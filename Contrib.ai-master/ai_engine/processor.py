# this file is running by node.js and then it read all the files in git repo and parse it and store it in vector database by making embedding of it.

import sys
import json
import os
from pymongo import MongoClient
import tree_sitter_python as tspython
import tree_sitter_javascript as tsjs
from tree_sitter import Language, Parser
from dotenv import load_dotenv

try:
    from google.genai import Client

    # print(" Successfully imported Client from google.genai")
except ImportError as e:
    sys.stderr.write(f" Import failed: {e}\n")
    sys.exit(1)
# Load variables from .env but don't override existing environment variables
load_dotenv(override=False)

# --- CONFIGURATION ---
MONGO_URI = os.getenv("MONGO_URI")
GEMINI_KEY = os.getenv("GEMINI_KEY")

if not GEMINI_KEY:
    sys.stderr.write("❌ ERROR: GEMINI_KEY environment variable is not set!\n")
    sys.exit(1)

if not MONGO_URI:
    sys.stderr.write("❌ ERROR: MONGO_URI environment variable is not set!\n")
    sys.exit(1)

client_ai = Client(api_key=GEMINI_KEY)
client = MongoClient(MONGO_URI)
db = client["code_agent"]
collection = db["embeddings"]
# models = client_ai.models.list()

# for m in models:
#     print(m)
# Initialize Tree-sitter parsers once (reuse them)
PY_LANGUAGE = Language(tspython.language())
JS_LANGUAGE = Language(tsjs.language())
py_parser = Parser(PY_LANGUAGE)
js_parser = Parser(JS_LANGUAGE)


def get_parser(file_path):
    if file_path.endswith(".py"):
        return py_parser, "function_definition"
    if file_path.endswith((".js", ".jsx", ".ts", ".tsx")):
        return js_parser, "function_declaration"
    return None, None


def process_file(file_path, repo_id):
    parser, target_node_type = get_parser(file_path)
    if not parser:
        sys.stderr.write(f"❌ Skipped {file_path} (No parser available)\n")
        return 0

    try:
        with open(file_path, "rb") as f:
            code_content = f.read()
    except Exception as e:
        sys.stderr.write(f"❌ Skipped {file_path} (Error reading file: {str(e)})\n")
        return 0

    try:
        tree = parser.parse(code_content)
        root = tree.root_node
    except Exception as e:
        sys.stderr.write(f"❌ Skipped {file_path} (Parse error: {str(e)})\n")
        return 0

    embeddings_to_insert = []
    count = 0

    def walk(node):
        nonlocal count
        target_types = [
            "function_declaration",
            "method_definition",
            "assignment_expression",
            "class_definition",
            "lexical_declaration",
            "variable_declaration",
        ]

        if node.type in target_types:
            name = None

            # 1. Handle standard declarations (functions/classes)
            if node.type in [
                "function_declaration",
                "method_definition",
                "class_definition",
            ]:
                name_node = node.child_by_field_name("name")
                if name_node:
                    try:
                        name = code_content[
                            name_node.start_byte : name_node.end_byte
                        ].decode("utf8")
                    except Exception as e:
                        sys.stderr.write(f"Error decoding name: {e}\n")
                        name = None

            # 2. Handle React Components (const MyComponent = ...)
            elif node.type in ["lexical_declaration", "variable_declaration"]:
                # Dig into the declaration to find the variable name
                # Structure: lexical_declaration -> variable_declarator -> identifier (name)
                for child in node.children:
                    if child.type == "variable_declarator":
                        id_node = child.child_by_field_name("name")
                        if id_node:
                            try:
                                name = code_content[
                                    id_node.start_byte : id_node.end_byte
                                ].decode("utf8")
                            except Exception as e:
                                sys.stderr.write(f"Error decoding variable name: {e}\n")
                            break

            # 3. Handle Express-style assignments
            elif node.type == "assignment_expression":
                left_node = node.child_by_field_name("left")
                right_node = node.child_by_field_name("right")
                if (
                    left_node
                    and right_node
                    and right_node.type in ["function_expression", "arrow_function"]
                ):
                    try:
                        name = code_content[
                            left_node.start_byte : left_node.end_byte
                        ].decode("utf8")
                    except Exception as e:
                        sys.stderr.write(f"Error decoding assignment name: {e}\n")
                        name = None

            if name:
                try:
                    body = code_content[node.start_byte : node.end_byte].decode("utf8")
                except Exception as e:
                    sys.stderr.write(f"Error decoding body: {e}\n")
                    body = None

                if body:
                    try:
                        # --- GEMINI EMBEDDING ---
                        embedding_result = client_ai.models.embed_content(
                            model="models/gemini-embedding-2-preview",
                            contents=body,
                            config={"task_type": "retrieval_document"},
                        )
                        vector = embedding_result.embeddings[0].values

                        # Collect embedding for batch insert
                        embeddings_to_insert.append(
                            {
                                "repo_id": repo_id,
                                "file_path": file_path,
                                "name": name,
                                "code": body,
                                "embedding": vector,
                            }
                        )
                        count += 1
                    except Exception as e:
                        sys.stderr.write(f"Error creating embedding for {name}: {e}\n")

        # Recursive call must be OUTSIDE the target_types check but INSIDE walk
        for child in node.children:
            walk(child)

    try:
        walk(root)
    except Exception as e:
        sys.stderr.write(f"Error walking tree for {file_path}: {e}\n")
    
    # Batch insert all embeddings from this file
    if embeddings_to_insert:
        try:
            collection.insert_many(embeddings_to_insert)
        except Exception as e:
            sys.stderr.write(f"Error inserting embeddings for {file_path}: {e}\n")
    
    return count

# the code inside  __name__ == "__main__" runs only when you run the file directly in terminal. and if you try to import this file in any other folder and then run this file then with the desired requirement you will also run the code outside of __name__=="main" but not the code not the inside one 
if __name__ == "__main__":
    # Usage: python processor.py [file_path] [repo_id] 
    # sys.argv read the python command run in terminal and extract f_path and repo_id from it. we run the command with help of node.js
    if len(sys.argv) > 2:
        f_path = sys.argv[1]
        r_id = sys.argv[2]
        processed_count = process_file(f_path, r_id)
        sys.stdout.write(json.dumps({"status": "success", "functions_saved": processed_count}))
    else:
        sys.stdout.write(json.dumps({"status": "error", "message": "Missing arguments"}))
