const nodemailer = require('nodemailer')

// Configure Gmail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// Common function to send emails
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"ProjectMate" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    })

    console.log('Email sent successfully:', info.messageId)
    return info
  } catch (error) {
    console.error('Email sending failed:', error.message)
    throw error
  }
}

// 1. Owner sends an invitation to a member
const sendInvitationEmail = async (user, project, owner) => {
  return sendEmail({
    to: user.email,
    subject: `You've been invited to join ${project.title}!`,
    text: `Hi ${user.name}, ${owner.name} has invited you to join the project ${project.title} on ProjectMate.`,
    html: `
      <h2>Hello ${user.name}!</h2>
      <p><strong>${owner.name}</strong> has invited you to join their project:</p>
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <p>Log in to ProjectMate to accept or reject this invitation.</p>
      <p>Best regards,<br>ProjectMate Team</p>
    `
  })
}

// 2. Member accepts an invitation
const sendInvitationAcceptedEmail = async (owner, user, project) => {
  return sendEmail({
    to: owner.email,
    subject: `${user.name} accepted your project invitation`,
    text: `${user.name} has accepted your invitation to join ${project.title}.`,
    html: `
      <h2>Good news, ${owner.name}!</h2>
      <p><strong>${user.name}</strong> has accepted your invitation.</p>
      <h3>Project: ${project.title}</h3>
      <p>They are now part of your project team.</p>
      <p>Best regards,<br>ProjectMate Team</p>
    `
  })
}

// 3. Member rejects an invitation
const sendInvitationRejectedEmail = async (owner, user, project) => {
  return sendEmail({
    to: owner.email,
    subject: `${user.name} declined your project invitation`,
    text: `${user.name} has rejected your invitation to join ${project.title}.`,
    html: `
      <h2>Hello ${owner.name},</h2>
      <p><strong>${user.name}</strong> has declined your invitation.</p>
      <h3>Project: ${project.title}</h3>
      <p>You can invite other members to your project.</p>
      <p>Best regards,<br>ProjectMate Team</p>
    `
  })
}

// 4. Someone sends a join request to a project
const sendJoinRequestEmail = async (owner, user, project, message) => {
  return sendEmail({
    to: owner.email,
    subject: `${user.name} wants to join ${project.title}`,
    text: `${user.name} has sent a join request for ${project.title}. Message: ${message}`,
    html: `
      <h2>Hello ${owner.name}!</h2>
      <p><strong>${user.name}</strong> wants to join your project:</p>
      <h3>${project.title}</h3>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      <p>Log in to ProjectMate to review this request.</p>
      <p>Best regards,<br>ProjectMate Team</p>
    `
  })
}

// 5. Owner accepts a join request
const sendJoinRequestAcceptedEmail = async (user, owner, project) => {
  return sendEmail({
    to: user.email,
    subject: `Your request to join ${project.title} has been accepted!`,
    text: `${owner.name} has accepted your request to join ${project.title}. You are now part of the project team.`,
    html: `
      <h2>Congratulations, ${user.name}!</h2>
      <p><strong>${owner.name}</strong> has accepted your request to join:</p>
      <h3>${project.title}</h3>
      <p>You are now part of the project team.</p>
      <p>Log in to ProjectMate to view your project.</p>
      <p>Best regards,<br>ProjectMate Team</p>
    `
  })
}

// 6. Owner rejects a join request
const sendJoinRequestRejectedEmail = async (user, owner, project) => {
  return sendEmail({
    to: user.email,
    subject: `Update on your request to join ${project.title}`,
    text: `${owner.name} has declined your request to join ${project.title}. You can explore other projects on ProjectMate.`,
    html: `
      <h2>Hello ${user.name},</h2>
      <p><strong>${owner.name}</strong> has declined your request to join:</p>
      <h3>${project.title}</h3>
      <p>Don't be discouraged! You can explore other projects on ProjectMate.</p>
      <p>Best regards,<br>ProjectMate Team</p>
    `
  })
}

module.exports = {
  sendInvitationEmail,
  sendInvitationAcceptedEmail,
  sendInvitationRejectedEmail,
  sendJoinRequestEmail,
  sendJoinRequestAcceptedEmail,
  sendJoinRequestRejectedEmail
}
