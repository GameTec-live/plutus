export function PasswordResetEmail({ url }: { url: string }) {
    return (
        <div>
            <h1>Password Reset Request</h1>
            <p>
                You have requested to reset your password. Please click the link
                below to proceed:
            </p>
            <a href={url}>Reset Password</a>
            <p>
                If you did not request this password reset, please ignore this
                email.
            </p>
        </div>
    );
}
