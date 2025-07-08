import { useState } from "react";
import Xarrow, { Xwrapper } from "react-xarrows";
import CategorySelector from "./CategorySelector";
import CreateRoutineButton from "./CreateRoutineButton";
import RoutineDisplay from "./RoutineDisplay";
import { handleCreateRoutine } from "./prompts/handleCreateRoutine";

function App() {
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [routine, setRoutine] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getSubcats = (cat: string | null) => {
    switch (cat) {
      case "Rhythm":
        return ["Charleston", "Shifted Charleston", "Mirrored Charleston"];
      case "Melody":
        return ["Scales", "Arpeggios", "Enclosures"];
      case "Harmony":
        return ["Shells", "Drop-2's", "Progressions"];
      default:
        return null;
    }
  };

  const subcats = getSubcats(selected);

  // Toggle function for main category
  const toggleMainCategory = (category: string) => {
    setSelected((prev) => (prev === category ? null : category));
    setSelectedSub(null);
    setSelectedTime(null);
  };

  // Toggle function for subcategory
  const toggleSubCategory = (subcategory: string) => {
    setSelectedSub((prev) => (prev === subcategory ? null : subcategory));
    setSelectedTime(null);
  };

  // Toggle function for time duration
  const toggleTimeDuration = (time: string) => {
    setSelectedTime((prev) => (prev === time ? null : time));
  };

  const handleGenerateRoutine = async () => {
    setIsLoading(true);
    try {
      const res = await handleCreateRoutine(
        selected,
        selectedSub,
        selectedTime
      );
      setRoutine(res);
    } catch (error) {
      console.error("Error generating routine:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Xwrapper>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-4">
        <h1 className="text-6xl font-bold mb-4 text-amber-400">JazzMate</h1>
        <h2 className="text-lg text-gray-300 mb-12">
          Personalized practice routines for jazz guitar
        </h2>
        <h3 className="text-3xl font-semibold mb-8 text-white">
          What do you want to work on?
        </h3>

        <CategorySelector
          prefix="main"
          categories={["Rhythm", "Melody", "Harmony"]}
          selected={selected}
          setSelected={(val) => {
            toggleMainCategory(val);
            setSelectedSub(null);
            setSelectedTime(null);
          }}
        />

        {subcats && (
          <div className="mt-16">
            <CategorySelector
              prefix="sub"
              categories={subcats}
              selected={selectedSub}
              setSelected={(val) => {
                toggleSubCategory(val);
                setSelectedTime(null);
              }}
            />
          </div>
        )}

        {selectedSub && (
          <div className="mt-16">
            <CategorySelector
              prefix="time"
              categories={["15 minutes", "30 minutes", "45 minutes"]}
              selected={selectedTime}
              setSelected={toggleTimeDuration}
            />
          </div>
        )}

        {selected && selectedSub && !selectedTime && (
          <>
            <Xarrow
              start={`main-${selected}`}
              end={`sub-${selectedSub}`}
              color="#FBBF24"
              strokeWidth={4}
              headSize={6}
              path="smooth"
              startAnchor={{ position: "bottom", offset: { x: 0 } }}
              endAnchor={{ position: "top", offset: { x: 0 } }}
              divContainerStyle={{ position: "relative", overflow: "visible" }}
            />
          </>
        )}
        {selected && selectedSub && selectedTime && (
          <>
            <Xarrow
              start={`main-${selected}`}
              end={`sub-${selectedSub}`}
              color="#FBBF24"
              strokeWidth={4}
              headSize={6}
              path="smooth"
              startAnchor={{ position: "bottom", offset: { x: 0 } }}
              endAnchor={{ position: "top", offset: { x: 0 } }}
              divContainerStyle={{ position: "relative", overflow: "visible" }}
            />
            <Xarrow
              start={`sub-${selectedSub}`}
              end={`time-${selectedTime}`}
              color="#FBBF24"
              strokeWidth={4}
              headSize={6}
              path="smooth"
              startAnchor={{ position: "bottom", offset: { x: 0 } }}
              endAnchor={{ position: "top", offset: { x: 0 } }}
              divContainerStyle={{ position: "relative", overflow: "visible" }}
            />
          </>
        )}
        {selected && selectedSub && selectedTime && (
          <CreateRoutineButton
            onClick={handleGenerateRoutine}
            isLoading={isLoading}
          />
        )}

        <RoutineDisplay routine={routine} onBack={() => setRoutine(null)} />
      </div>
    </Xwrapper>
  );
}

export default App;
