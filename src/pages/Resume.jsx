import GlassCard from "../components/GlassCard";
import "./resume.css";

export default function Resume(){
    return(
        <div className="page">
            <GlassCard>
                <h1>Uppload your Resume</h1>

                <div className="drop-zone">
                    <p>Drag & drop your resume</p>
                    <span>PDF or DOCX</span>
                </div>

                <button className="primary-btn">Analyze Resume</button>
            </GlassCard>
        </div>
    )
}