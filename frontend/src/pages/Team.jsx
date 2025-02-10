import { useEffect } from "react";
import { useTeam } from "../store/useTeam";
import { useauthStore } from "../store/useAuthStore";

const Team = ({ t }) => {
  const { getTeamparticipants, teamParticipants } = useTeam();
  const { onlineUsers } = useauthStore();

  // Fetch team participants whenever the team name changes
  useEffect(() => {
    getTeamparticipants(t.teamName);
  }, [t.teamName, getTeamparticipants]);

  const members = teamParticipants[t.teamName] || []; // Fallback to an empty array if undefined
  console.log(`members of the team ${t.teamName} is:- ${members.profilePic}`)
  return (
    <div className="card w-auto bg-base-100 shadow-xl" style={{ border: "2px solid black", margin: "20px" }}>
      {/* Team Image */}
      <figure>
        <img
          src={t.teampic || "/default-team.jpg"}
          alt="Team"
          style={{ width: "80%", height: "200px", objectFit: "cover",marginTop:'20px'}}
        />
      </figure>

      <div className="card-body">
        {/* Team Details */}
        <h2 className="card-title">
          <b>Team Name:</b> {t.teamName}
        </h2>
        <p>
          <b>Project Name:</b> {t.projectName}
        </p>

        {/* Team Members */}
        <div>
          <p>
            <b>Team Members:</b>
          </p>
          <div className="flex flex-row overflow-x-auto w-full py-2 space-x-4">
            {members.length > 0 ? (
              members.map((user) => (
                <div
                  key={user._id}
                  className="relative flex-shrink-0 text-center"
                  style={{
                    height: "120px",
                    width: "120px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.fullName}
                    style={{
                      height: "80px",
                      width: "80px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  {onlineUsers.includes(user._id) && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        right: "10px",
                        height: "12px",
                        width: "12px",
                        backgroundColor: "green",
                        borderRadius: "50%",
                        border: "2px solid white",
                      }}
                    />
                  )}
                  <div className="text-center mt-2">
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {user.fullName}
                    </div>
                    <div style={{ fontSize: "12px", color: "#9ca3af" }}>
                      {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-zinc-500 py-4 w-full">
                No members in this team
              </div>
            )}
          </div>
        </div>

        {/* Deadline and Actions */}
        <div className="card-actions mt-4">
          <p>
            <b>Deadline:</b> {t.deadLine || "Not specified"}
          </p>
        </div>

     
      </div>
    </div>
  );
};

export default Team;
