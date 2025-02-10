import React, { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";
import {useTeam} from "../store/useTeam"

const TicketGenerator = ({teamname="Dominator",name="subham"}) => {
  const {TicketSubmission}=useTeam();
  const [ticketDetails, setTicketDetails] = useState({
    name:name,
    teamName:teamname,
    time: "",
    ticketName: "",
    bookingDate: new Date().toLocaleDateString(),
    bookingID: Math.random().toString(36).substring(2, 10),
  });


  
  const [showTicket, setShowTicket] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicketDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleGenerateTicket = () => {
    if (
      !ticketDetails.teamName ||
        !ticketDetails.time ||
      !ticketDetails.ticketName 
     
    ) {
      alert("Please fill in all fields to generate the ticket.");
      return;
    }
    setShowTicket(true);
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const ticketNode = document.getElementById("ticket-preview");
      if (!ticketNode) {
        throw new Error("Ticket preview element not found.");
      }
    let data = `${ticketDetails.bookingID.trim()}|${ticketDetails.teamName.trim()}|${ticketDetails.name}|techmela-2025`
      const qrCodeImage = await QRCode.toDataURL(data);
      console.log(qrCodeImage)
      const ticketContent = ticketNode.innerText;
     
      if (!ticketContent) {
        throw new Error("Ticket content is empty.");
      } 
  
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600,400]);
  
      
      const { height } = page.getSize();
      const fontSize = 14;
  
      // Load a standard font
      const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
      // Add text to the PDF
      const lines = ticketContent.split("\n");
      const labels = ["Booking Date", "Booking ID", "Attendee Details",`${ticketDetails.teamName}`, "Event Name",'Event Date', , "Location"];
      let yPosition = height - fontSize * 4;
  
      lines.forEach((line,index) => {
        if(index==3){yPosition -= fontSize ;}
            
        if (line.trim()) { // Check if the line is not empty
          const [label, value] = line.split(":").map((str) => str.trim()); // Split and trim
  
          if (labels.includes(label)) {
            // Draw the label in bold
            page.drawText(label, {
              x: 50,
              y: yPosition,
              size: fontSize,
              font: boldFont,
              color: rgb(0, 0, 0),
            });
          }
  
          if (value ) {
            
            // Draw the value in regular font
            page.drawText(value, {
              x: 170,
              y: yPosition,
              size: fontSize,
              font: regularFont,
              color: rgb(0, 0, 0),
            });
          }
  
          yPosition -= fontSize + 18;
        // Adjust vertical position
        }
      
      });
  
      // Embed QR Code as an image
      const qrImageBytes = await fetch(qrCodeImage).then((res) => res.arrayBuffer());
      const qrImage = await pdfDoc.embedPng(qrImageBytes);
      const qrImageDimensions = qrImage.scale(1.5);
  
      page.drawImage(qrImage, {
        x: 350,
        y: height - 200,
        width: qrImageDimensions.width,
        height: qrImageDimensions.height,
      });
  
      // Serialize the PDF to bytes
      const pdfBytes = await pdfDoc.save();
  
      // Trigger download
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const reader = new FileReader();
     reader.readAsDataURL(blob);
      reader.onload = async () => {
        const base64Pdf = reader.result; // Base64 string of the PDF
        try {
          const response = await TicketSubmission({teamName :ticketDetails.teamName,name:[ticketDetails.name], pdf: base64Pdf });
          alert("Ticket uploaded successfully!");
        } catch (error) {
          console.error("Error uploading PDF:", error);
          alert("Failed to upload PDF.");
        }
      };
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "ticket.pdf";
      link.click();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please check the console for more details.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Event Ticket Generator</h1>
      <div style={formStyle}>
        {["ticketName", "time"].map((field) => (
          <label key={field}>
            {field.charAt(0).toUpperCase() + field.slice(1)}:
            <input
              type={field === "date" ? "date" : field === "time" ? "time" : "text"}
              name={field}
              value={ticketDetails[field]}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </label>
        ))}
        <button onClick={handleGenerateTicket} style={buttonStyle}>
          Generate Ticket
        </button>
      </div>

      {showTicket && (
        <div>
          
          <button
            onClick={handleDownloadPDF}
            style={{ ...buttonStyle, marginTop: "10px" }}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Download PDF"}
          </button>
        </div>
      )}
    </div>
  );
};

const formStyle = {
  margin: "20px 0",
  textAlign: "left",
  maxWidth: "400px",
  marginInline: "auto",
};

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "8px",
  margin: "10px 0",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  backgroundColor: "#007BFF",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const ticketStyle = {
  margin: "20px auto",
  padding: "20px",
  width: "350px",
  textAlign: "left",
  backgroundColor: "#f8f9fa",
  border: "1px solid #ccc",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

export default TicketGenerator;
