export default async function UserProfilePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return (
        <div>
            <h1>User Profile</h1>
            <p>User ID: {id}</p>
        </div>
    );
}
