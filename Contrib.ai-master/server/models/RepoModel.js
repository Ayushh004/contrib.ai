import mongoose from "mongoose";


const RepoSchema = new mongoose.Schema(
    {
        jobId: {
            type: String,
            required: true
        },
        repoLink: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true,
    }

)

const Repo = mongoose.model("Repo", RepoSchema);
export default Repo;