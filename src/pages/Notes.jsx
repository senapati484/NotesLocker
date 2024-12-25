import { useParams } from "react-router-dom";

const Notes = () => {
  const { username } = useParams();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold">Welcome, {username}!</h1>
      <p className="text-lg mt-2">This is your personalized dashboard.</p>
    </div>
  );
};

export default Notes;
