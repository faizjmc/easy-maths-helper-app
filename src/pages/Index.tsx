
import { EquationEditor } from "@/components/EquationEditor";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-2 text-purple-800">Maths Scribe</h1>
      <p className="text-gray-600 mb-6">Create and edit mathematical equations</p>
      <EquationEditor />
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>A mathematical equation editor built with React & Tailwind CSS</p>
      </footer>
    </div>
  );
};

export default Index;
