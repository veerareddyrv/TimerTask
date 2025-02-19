import { useState } from "react";
import { Plus, Clock } from "lucide-react";
import { TimerList } from "./components/TimerList";
// import { AddTimerModal } from "./components/AddTimerModal";
import { AddEditTimerModal } from "./components/AddEditTimerModal";
import { Toaster } from "sonner";


function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddTimer, setIsAddTimer] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Timer App</h1>
          </div>
          <button
            onClick={() => {
              setIsModalOpen(!isModalOpen);
              setIsAddTimer(!isAddTimer);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" /> Add Timer
          </button>
        </div>

        <TimerList />
        <AddEditTimerModal
          isOpen={isModalOpen}
          isAdd={isAddTimer}
          onClose={() => {
            setIsModalOpen(!isModalOpen);
            setIsAddTimer(!isAddTimer);
          } } isEdit={false}        />

        {/* <AddTimerModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(!isModalOpen);
          }}
        /> */}
      </div>
    </div>
  );
}

export default Home;
