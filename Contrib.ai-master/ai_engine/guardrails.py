"""
Guardrails module for LLM input/output validation and security.
Provides comprehensive security measures for AI interactions.
"""

import re
import logging
import threading
import time
from typing import Optional, Dict, Any
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI
import os
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

class InputGuardrails:
    """Validates and sanitizes user input before processing by LLM"""
    
    # Patterns for common attacks
    MALICIOUS_PATTERNS = [
        r'<script[^>]*>.*?</script>',  # XSS attempts
        r'javascript:',  # JavaScript protocol
        r'on\w+\s*=',  # Event handlers
        r'(union|select|insert|delete|drop|alter|exec)\s+',  # SQL injection
        r'(\|\|&&|\;)',  # Command injection
        r'\$\([^)]*\)',  # Command substitution
        r'`[^`]*`',  # Backtick command execution
        r'\.\./',  # Path traversal
        r'\x00',  # Null byte
    ]
    
    @staticmethod
    def validate_input(query: str) -> tuple[bool, Optional[str]]:
        """
        Validate user input for security issues.
        
        Args:
            query: User input string
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        if not isinstance(query, str) or not query.strip():
            return False, "Input cannot be empty"
        
        # Check length limits
        if len(query) > 5000:
            return False, "Input exceeds maximum length of 5000 characters"
        
        # Check for malicious patterns
        for pattern in InputGuardrails.MALICIOUS_PATTERNS:
            if re.search(pattern, query, re.IGNORECASE):
                logger.warning(f"Blocked potentially malicious input: {query[:100]}")
                return False, "Input contains potentially harmful content"
        
        # Check for long runs of the same character (potential DoS).
        if InputGuardrails._check_excessive_repetition(query):
            return False, "Input contains excessive repetition"
        
        return True, None
    
    @staticmethod
    def _check_excessive_repetition(text: str, threshold: int = 50) -> bool:
        """Check for an unusually long run of one repeated character."""
        return re.search(r"(.)\1{%d,}" % threshold, text) is not None
    
    @staticmethod
    def sanitize_input(query: str) -> str:
        """Basic sanitization of input"""
        # Remove null bytes
        sanitized = query.replace('\x00', '')
        # Trim excessive whitespace
        sanitized = ' '.join(sanitized.split())
        return sanitized


class OutputGuardrails:
    """Validates and filters LLM output for safety and appropriateness"""
    
    @staticmethod
    def validate_output(output: str) -> tuple[bool, Optional[str]]:
        """
        Validate LLM output for safety issues.
        
        Args:
            output: LLM generated response
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        if not isinstance(output, str) or not output.strip():
            return False, "Empty output from LLM"
        
        # Check for code injection in output
        dangerous_patterns = [
            r'<script[^>]*>.*?</script>',
            r'javascript:',
            r'document\.cookie',
            r'eval\s*\(',
            r'exec\s*\(',
        ]
        
        for pattern in dangerous_patterns:
            if re.search(pattern, output, re.IGNORECASE):
                logger.warning(f"Blocked potentially malicious output: {output[:100]}")
                return False, "Output contains potentially harmful content"
        
        # Check for excessive length
        if len(output) > 10000:
            return False, "Output exceeds maximum length"
        
        return True, None
    
    @staticmethod
    def filter_sensitive_info(output: str) -> str:
        """Filter potential sensitive information from output"""
        # This is a basic implementation - enhance based on your needs
        patterns_to_filter = [
            (r'api[_-]?key["\']?\s*[:=]\s*["\']?[a-zA-Z0-9_\-]{20,}', '[API_KEY_REDACTED]'),
            (r'password["\']?\s*[:=]\s*["\']?[^\s"\']+', '[PASSWORD_REDACTED]'),
            (r'secret["\']?\s*[:=]\s*["\']?[^\s"\']+', '[SECRET_REDACTED]'),
        ]
        
        filtered = output
        for pattern, replacement in patterns_to_filter:
            filtered = re.sub(pattern, replacement, filtered, flags=re.IGNORECASE)
        
        return filtered


class LLMGuardrailChain:
    """Integrates guardrails into the LLM processing chain"""
    
    def __init__(self):
        self.input_guardrails = InputGuardrails()
        self.output_guardrails = OutputGuardrails()
        
        # Create safety check chain
        self.safety_template = """
        You are a content safety moderator. Check if the following content is safe and appropriate.
        Respond with exactly "SAFE" or "UNSAFE" followed by a brief explanation.
        
        Content to check: {content}
        
        Response format: SAFE/UNSAFE - [brief explanation]
        """
        
        self.safety_prompt = ChatPromptTemplate.from_template(self.safety_template)
        guardrail_llm = ChatGoogleGenerativeAI(
            model="models/gemini-2.5-flash",
            google_api_key=os.getenv("GEMINI_KEY"),
            temperature=0
        )
        self.safety_chain = (
            self.safety_prompt 
            | guardrail_llm 
            | StrOutputParser()
        )
    
    def validate_input_with_llm(self, query: str) -> tuple[bool, str]:
        """
        Use LLM to check if input is safe and appropriate.
        
        Args:
            query: User input to validate
            
        Returns:
            Tuple of (is_safe, explanation)
        """
        try:
            result = self.safety_chain.invoke({"content": query})
            is_safe = result.strip().upper().startswith("SAFE")
            explanation = result.split("-", 1)[-1].strip() if "-" in result else result
            return is_safe, explanation
        except Exception as e:
            logger.error(f"LLM safety check failed: {e}")
            # Fall back to rule-based validation
            return True, "LLM check failed, using rule-based validation"
    
    def process_with_guardrails(
        self, 
        query: str, 
        llm_chain,
        use_llm_validation: bool = False
    ) -> Dict[str, Any]:
        """
        Process query through LLM with comprehensive guardrails.
        
        Args:
            query: User input
            llm_chain: The main LLM processing chain
            use_llm_validation: Whether to use LLM for additional safety checks
            
        Returns:
            Dictionary with success status, result, and any warnings
        """
        # Phase 1: Rule-based input validation
        is_valid, error = self.input_guardrails.validate_input(query)
        if not is_valid:
            return {
                "success": False,
                "result": None,
                "error": error,
                "warning": "Input blocked by security rules"
            }
        
        # Phase 2: Optional LLM-based validation
        if use_llm_validation:
            is_safe, explanation = self.validate_input_with_llm(query)
            if not is_safe:
                return {
                    "success": False,
                    "result": None,
                    "error": explanation,
                    "warning": "Input blocked by AI safety check"
                }
        
        # Sanitize input
        sanitized_query = self.input_guardrails.sanitize_input(query)
        
        # Phase 3: Process through main LLM chain
        try:
            result = llm_chain.invoke(sanitized_query)
        except Exception as e:
            logger.error(f"LLM processing failed: {e}")
            return {
                "success": False,
                "result": None,
                "error": str(e),
                "warning": "LLM processing failed"
            }
        
        # Phase 4: Output validation
        is_valid, error = self.output_guardrails.validate_output(result)
        if not is_valid:
            return {
                "success": False,
                "result": None,
                "error": error,
                "warning": "Output blocked by security rules"
            }
        
        # Phase 5: Filter sensitive information
        filtered_result = self.output_guardrails.filter_sensitive_info(result)
        
        return {
            "success": True,
            "result": filtered_result,
            "warnings": []
        }


class RateLimiter:
    """Basic rate limiting for API protection"""
    
    def __init__(self, max_requests: int = 100, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = {}  # In production, use Redis or similar
        self._lock = threading.Lock()
    
    def is_allowed(self, user_id: str) -> tuple[bool, Optional[str]]:
        """
        Check if user is within rate limits.
        
        Args:
            user_id: Identifier for the user
            
        Returns:
            Tuple of (is_allowed, error_message)
        """
        current_time = time.time()
        with self._lock:
            if user_id not in self.requests:
                self.requests[user_id] = []

            self.requests[user_id] = [
                req_time for req_time in self.requests[user_id]
                if current_time - req_time < self.window_seconds
            ]

            if len(self.requests[user_id]) >= self.max_requests:
                return False, f"Rate limit exceeded: {self.max_requests} requests per {self.window_seconds} seconds"

            self.requests[user_id].append(current_time)
            return True, None


# Convenience function for quick integration
def apply_guardrails_to_chain(llm_chain, use_llm_validation: bool = False):
    """
    Decorator/wrapper to apply guardrails to any LLM chain.
    
    Args:
        llm_chain: The LLM chain to protect
        use_llm_validation: Whether to use LLM for additional safety checks
        
    Returns:
        Wrapped chain with guardrails
    """
    guardrail_system = LLMGuardrailChain()
    
    def guarded_chain(query: str):
        return guardrail_system.process_with_guardrails(
            query, 
            llm_chain, 
            use_llm_validation
        )
    
    return guarded_chain