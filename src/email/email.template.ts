export const RENTALAPPRESALTEMPLATE = (email: any): string => {
  return `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            h2 {
              color: #4CAF50;
            }
            p {
              font-size: 16px;
              line-height: 1.5;
              margin: 10px 0;
            }
            strong {
              color: #000;
            }
            .footer {
              font-size: 14px;
              color: #888;
              margin-top: 20px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>New Rental Appraisal Submission</h2>
            <p><strong>Name:</strong> ${email.name}</p>
            <p><strong>Email:</strong> ${email.email}</p>
            <p><strong>Phone Number:</strong> ${email.phoneNumber}</p>
            <p><strong>Address:</strong> ${email.streetAddress}, ${email.suburb}, ${email.postCode}</p>
            <p><strong>Bedrooms:</strong> ${email.bedRooms}</p>
            <p><strong>Car Space:</strong> ${email.carSpace}</p>
            <p><strong>Bathrooms:</strong> ${email.bathroom}</p>
            <p><strong>Additional Details:</strong> ${email.additionalDetails}</p>
            <p><strong>Additional Message:</strong> ${email.additionalMessage}</p>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply directly.</p>
          </div>
        </body>
      </html>
    `;
};

export const DIGITALAPPRAISALTEMPLATE = (formData: any): string => {
  return `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            h2 {
              color: #4CAF50;
            }
            p {
              font-size: 16px;
              line-height: 1.5;
              margin: 10px 0;
            }
            .section {
              margin-bottom: 20px;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            ul {
              padding-left: 20px;
            }
            li {
              font-size: 16px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>New Digital Appraisal  Submission !</h2>
            <div class="section">
              <div class="section-title">Personal Details</div>
              <p><strong>First Name:</strong> ${formData.firstName || "N/A"}</p>
              <p><strong>Last Name:</strong> ${formData.lastName || "N/A"}</p>
              <p><strong>Mobile Number:</strong> ${
                formData.mobileNumber || "N/A"
              }</p>
              <p><strong>Email:</strong> ${formData.email || "N/A"}</p>
              <p><strong>Address:</strong> ${formData.address || "N/A"}</p>
            </div>
            <div class="section">
              <div class="section-title">Property Details</div>
              <p><strong>Property Type:</strong> ${
                formData.propertyType || "N/A"
              }</p>
              <p><strong>Approximate Value:</strong> ${
                formData.approximate || "N/A"
              }</p>
              <p><strong>Favourite Features:</strong> ${
                formData.favoriteFeatures || "N/A"
              }</p>
              <p><strong>Selling Time:</strong> ${
                formData.sellingTime || "N/A"
              }</p>
              <p><strong>Home Age:</strong> ${formData.homeAge || "N/A"}</p>
            </div>
            <div class="section">
              <div class="section-title">Additional Details</div>
              <p><strong>Improvements:</strong> ${
                formData.improvements || "N/A"
              }</p>
              <p><strong>Bedrooms:</strong> ${formData.bedroom || "N/A"}</p>
              <p><strong>Bathrooms:</strong> ${formData.bathroom || "N/A"}</p>
              <p><strong>Ensuite:</strong> ${formData.ensuite || "N/A"}</p>
              <p><strong>Living Areas:</strong> ${
                formData.livingareas || "N/A"
              }</p>
              <p><strong>Study:</strong> ${formData.study || "N/A"}</p>
              <p><strong>Garaging:</strong> ${formData.garaging || "N/A"}</p>
            </div>
            <div class="section">
              <div class="section-title">Features</div>
              <p><strong>Heating/Cooling:</strong></p>
              <ul>
                ${
                  formData.heatingCooling
                    .map((item: string) => `<li>${item}</li>`)
                    .join("") || "<li>N/A</li>"
                }
              </ul>
              <p><strong>Fun Stuff:</strong></p>
              <ul>
                ${
                  formData.funStuff
                    .map((item: string) => `<li>${item}</li>`)
                    .join("") || "<li>N/A</li>"
                }
              </ul>
              <p><strong>Other Features:</strong></p>
              <ul>
                ${
                  formData.otherFeatures
                    .map((item: string) => `<li>${item}</li>`)
                    .join("") || "<li>N/A</li>"
                }
              </ul>
            </div>
            <div class="section">
              <div class="section-title">Referral and Comments</div>
              <p><strong>Referred By:</strong> ${
                formData.referredBy || "N/A"
              }</p>
              <p><strong>Additional Comments:</strong> ${
                formData.additionalComments || "N/A"
              }</p>
            </div>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply directly.</p>
          </div>
        </body>
      </html>
    `;
};

export const BUYWITHUSTEMPLATE = (formData: any) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
    <h2 style="text-align: center; color: #555;">New Inquiry Submission</h2>
    <p><strong>Name:</strong> ${formData.name}</p>
    <p><strong>Phone:</strong> ${formData.phone}</p>
    <p><strong>Email:</strong> ${formData.email}</p>
    <p><strong>Best Time to Reach:</strong> ${formData.bestTimeToReach}</p>
    <p><strong>Interested Cities:</strong> ${
      formData.interestedCities.join(", ") || "N/A"
    }</p>
    <p><strong>Home Type:</strong> ${formData.homeType}</p>
    <p><strong>Bedrooms:</strong> ${formData.bedrooms}</p>
    <p><strong>Bathrooms:</strong> ${formData.bathrooms}</p>
    <p><strong>Garage:</strong> ${formData.garage}</p>
    <p><strong>Floors:</strong> ${formData.floors}</p>
    <p><strong>Budget:</strong> ${formData.budget}</p>
    <p><strong>Lot Size:</strong> ${formData.lotSize}</p>
    <p><strong>Amenities:</strong> ${formData.amenities.join(", ") || "N/A"}</p>
    <p><strong>Additional Comments:</strong> ${
      formData.additionalComments || "None"
    }</p>
    <p style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">This is an automated message. Please do not reply.</p>
  </div>
`;
