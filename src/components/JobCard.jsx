import "./job.css";

export default function JobCard({title, company, match}) {
    return(
        <div className="job-card">
            <h3>{title}</h3>
            <p>{company}</p>

            <div className="match">
                <span>Match</span>
                <strong>{match}%</strong>
            </div>
        </div>
    );
}