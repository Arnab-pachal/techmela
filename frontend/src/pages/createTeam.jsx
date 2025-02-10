import React, { useState, useEffect } from "react";
import { Loader2, User } from "lucide-react"; // Icons from lucide-react
import { useTeam } from "../store/useTeam"; // Custom hook for team operations
import { useauthStore } from "../store/useAuthStore"; // Custom hook for auth operations
import Team from "./Team"; // Component to display individual team details
import QRCode from "qrcode";
import { toJpeg } from 'html-to-image';

import { axiosInstance } from "../lib/axios";
const CreateTeam = () => {
  const {
    createTeam,
    team,
    visibleupdate,
    setvisibleupdate,
    updateTeam,
    deleteTeam,
    getallTeam,
  } = useTeam();
  const { authUser } = useauthStore();

  const [formdata, setFormdata] = useState({
    teamName: "",
    deadline: "",
    project: "",
    teamStrength: 0,
    participants: [], // Array of objects { name: "", email: "" }
  });

  const [form, setForm] = useState({
    teamName: "",
    deadline: "",
    project: "",
    teamStrength: 0,
    participants: [],
  });

  const [submit, setSubmit] = useState(false);
  const [update, setUpdate] = useState(false);

  // Handle changes to participant details for creating a team
  const handleParticipantChange = (index, field, value) => {
    setFormdata((prevData) => {
      const updatedParticipants = [...prevData.participants];
      updatedParticipants[index] = {
        ...updatedParticipants[index],
        [field]: value,
      };
      return { ...prevData, participants: updatedParticipants };
    });
  };

  // Handle team strength change for creating a team
  const handleTeamStrengthChange = (e) => {
    const teamStrength = parseInt(e.target.value, 10) || 0;
    setFormdata((prevData) => ({
      ...prevData,
      teamStrength,
      participants: Array.from({ length: teamStrength }, (_, i) => ({
        name: prevData.participants[i]?.name || "",
        email: prevData.participants[i]?.email || "",
      })),
    }));
  };

  // Handle changes to participant details for updating a team
  const handleParticipantChange1 = (index, field, value) => {
    setForm((prevData) => {
      const updatedParticipants = [...prevData.participants];
      updatedParticipants[index] = {
        ...updatedParticipants[index],
        [field]: value,
      };
      return { ...prevData, participants: updatedParticipants };
    });
  };

  // Handle team strength change for updating a team
  const handleTeamStrengthChange1 = (e) => {
    const teamStrength = parseInt(e.target.value, 10) || 0;
    setForm((prevData) => ({
      ...prevData,
      teamStrength,
      participants: Array.from({ length: teamStrength }, (_, i) => ({
        name: prevData.participants[i]?.name || "",
        email: prevData.participants[i]?.email || "",
      })),
    }));
  };

  // Validate the form before submission
  const validateForm = () => {
    if (formdata.teamName.trim().length === 0) {
      alert("Please provide a team name");
      return false;
    }
    return true;
  };

  // Fetch all teams when the component mounts
  useEffect(() => {
    getallTeam();
  }, []);
  const makeimage = async (participant, teamName, eventDate) => {
    const data = JSON.stringify({
      name: participant.name,
      email: participant.email,
      team: teamName,
      event: "TechMela-2025",
      eventDate,
    });
  
    // Generate QR Code
    const qrCodeImage = await QRCode.toDataURL(data);
  
    // Create a temporary DOM element for the ticket
    const ticketDiv = document.createElement("div");
  
    ticketDiv.style.height = "200px"; // Adjusted height for a more compact look
    ticketDiv.style.background = "#f4f4f4";
    ticketDiv.style.padding = "10px"; // Reduced padding
    ticketDiv.style.fontFamily = "Arial";
    ticketDiv.style.display = "flex"; // Use flexbox for layout
    ticketDiv.style.justifyContent = "flex-start"; // Align items to the start
    ticketDiv.style.alignItems = "center";
  
    // Text content
    const contentDiv = document.createElement("div");
    contentDiv.style.flex = "1"; // Allow the content to take up remaining space
    contentDiv.style.paddingRight = "10px"; // Minimum gap between text and QR code
    contentDiv.innerHTML = `
      <h2 style="margin: 0;"><strong>TechMela-2025</strong></h2>
      <p style="margin: 4px 0;"><strong>Team:</strong> ${teamName}</p>
      <p style="margin: 4px 0;"><strong>Name:</strong> ${participant.name}</p>
      <p style="margin: 4px 0;"><strong>Email:</strong> ${participant.email}</p>
      <p style="margin: 4px 0;"><strong>Event Date:</strong> ${eventDate}</p>
    `;
  
    // QR Code container
    const qrDiv = document.createElement("div");
    qrDiv.style.width = "100px";
    qrDiv.style.height = "100px";
    qrDiv.style.display = "flex";
    qrDiv.style.justifyContent = "center";
    qrDiv.style.alignItems = "center";
    qrDiv.style.background = "#fff";
    qrDiv.style.border = "1px solid #ccc";
    qrDiv.innerHTML = `<img src="${qrCodeImage}" alt="QR Code" style="width: 100%; height: 100%;" />`;
  
    // Append content and QR code to the ticket
    ticketDiv.appendChild(contentDiv);
    ticketDiv.appendChild(qrDiv);
  
    document.body.appendChild(ticketDiv);
     // Append it to the DOM temporarily
  
    // Convert the element to a JPEG image
    const jpegImage = await toJpeg(ticketDiv, { quality: 1});
  
    // Log or return the JPEG image
    console.log(jpegImage);
    participant.token = jpegImage;
    return jpegImage;
  };
  
  
  // Handle form submission
  const handleSubmit = async (e, msg, t) => {
    e.preventDefault();
    if (!authUser.isHost) {
      alert("Only Admin Can Change Team Info");
      return;
    }
    if (msg === "update") {
      if (form.teamName === "") form.teamName = t.teamName;
      if (form.deadline === "") form.deadline = t.deadLine;
      if (form.project === "") form.project = t.projectName;

      setUpdate(true);
      await updateTeam(form, t._id);
      setForm({
        teamName: "",
        deadline: "",
        project: "",
        teamStrength: 0,
        participants: [],
      });
      setUpdate(false);
    } else if (msg === "create") {
      const isValid = validateForm();
      if (isValid) {
        setSubmit(true);
        for(let Participant of formdata.participants){
          await makeimage(Participant,formdata.teamName,"TechMela-2025");
        }

        await createTeam(formdata);
        setFormdata({
          teamName: "",
          deadline: "",
          project: "",
          teamStrength: 0,
          participants: [],
        });
        setSubmit(false);
      }
    }
  };

  // Handle update toggle
  const handleUpdate = async (id) => {
    await setvisibleupdate(id);
  };

  // Handle team deletion
  const handleDelete = async (id) => {
    await deleteTeam(id);
    getallTeam();
  };

  const absent = () => {
    setvisibleupdate("");
  };

  return (
    <div style={{ marginTop: "80px" }}>
      {authUser.isHost ? (
        <>
          <form onSubmit={(e) => handleSubmit(e, "create")} className="space-y-6">
            {/* Team Name Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Team Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Enter Team Name"
                value={formdata.teamName}
                onChange={(e) =>
                  setFormdata({ ...formdata, teamName: e.target.value })
                }
              />
            </div>

            {/* Other Input Fields */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Project Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Enter Project Name"
                value={formdata.project}
                onChange={(e) =>
                  setFormdata({ ...formdata, project: e.target.value })
                }
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Deadline</span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full"
                value={formdata.deadline}
                onChange={(e) =>
                  setFormdata({ ...formdata, deadline: e.target.value })
                }
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Team Strength</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="Enter Team Strength"
                value={formdata.teamStrength}
                onChange={handleTeamStrengthChange}
              />
            </div>

            {/* Participants */}
            {formdata.participants.map((participant, index) => (
              <div key={index} className="form-control space-y-2">
                <label className="label">
                  <span className="label-text">Participant {index + 1}</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder={`Participant ${index + 1} Name`}
                  value={participant.name}
                  onChange={(e) =>
                    handleParticipantChange(index, "name", e.target.value)
                  }
                />
                <input
                  type="email"
                  className="input input-bordered w-full"
                  placeholder={`Participant ${index + 1} Email`}
                  value={participant.email}
                  onChange={(e) =>
                    handleParticipantChange(index, "email", e.target.value)
                  }
                />
              </div>
            ))}

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-full" disabled={submit}>
              {submit ? (
                <>
                  <Loader2 className="animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Team"
              )}
            </button>
          </form>
        </>
      ) : (
        <></>
      )}

      {/* Display Teams */}
      <p className="mt-6" style={{ textAlign: "center" }}>
        {authUser.isHost ? <span>All Teams:</span> : <span>Your Team</span>}
      </p>
      {authUser.isHost?(<div className="flex-1 overflow-y-auto p-4 space-y-4">
        {team.map((t) => (
          <div key={t._id}>
            <Team t={t} />
            {visibleupdate.includes(t._id) ? (
              <form onSubmit={(e) => handleSubmit(e, "update", t)} className="space-y-6">
                {/* Update Form */}
                {/* ... */}
              </form>
            ) : (
              <>
                <button
                  className="btn btn-outline btn-primary"
                  onClick={() => handleUpdate(t._id)}
                  style={{ margin: "10px" }}
                >
                  Update
                </button>
                <button
                  className="btn btn-outline btn-accent"
                  onClick={() => handleDelete(t._id)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>):<div className="flex-1 overflow-y-auto p-4 space-y-4">
        {team.map((t) => (
        authUser.TeamName==t.teamName&&<div key={t._id}>
            <Team t={t} />
          
            
          </div>
        ))}
      </div>}
      
    </div>
  );
};

export default CreateTeam;
