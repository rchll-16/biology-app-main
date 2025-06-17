import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Import all lesson components (ensure paths are correct)
import Introduction from './Lessons/Introduction';
import Cell_Theory from './Lessons/Cell_Theory';
import Cell_Structure from './Lessons/Cell_Structure';
import ProcxEuk from './Lessons/ProcxEuk';
import Cell_Type from './Lessons/Cell_Type';
import Cell_Mod from './Lessons/Cell_Mod';

// Map string IDs to components
const lessonComponents = {
  lesson1: Introduction,
  lesson2: Cell_Theory,
  lesson3: Cell_Structure,
  lesson4: ProcxEuk,
  lesson5: Cell_Type,
  lesson6: Cell_Mod
};

const LessonPage = () => {
  const { id } = useParams(); // e.g., 'lesson1'
  const [Component, setComponent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      if (!id) {
        setError('❌ No lesson ID found in URL.');
        return;
      }

      const selectedComponent = lessonComponents[id];

      if (!selectedComponent) {
        console.warn(`Lesson component not found for ID: ${id}`);
        setError(`Lesson "${id}" not found.`);
        return;
      }

      setComponent(() => selectedComponent);
    } catch (err) {
      console.error('Error loading lesson:', err);
      setError('Something went wrong loading the lesson.');
    }
  }, [id]);

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  if (!Component) {
    return (
      <div className="p-6 text-center text-gray-600">
        🔄 Loading lesson content...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Component />
    </div>
  );
};

export default LessonPage;
