// cellTypeData.js
import PlantCell from '../../../assets/images/plant_cell.png';
import AnimalCell from '../../../assets/images/animal_cell2.png';
import ProtistCell from '../../../assets/images/protist_cell.png';
import FungalCell from '../../../assets/images/fungal_cell.png';

const cellTypeData = [
  {
    type: 'Animal',
    image: AnimalCell,
    description:
      'Animal cells are eukaryotic cells characterized by a flexible plasma membrane without a cell wall, containing a true nucleus that houses DNA and various membrane-bound organelles.',
    fact: 'Animal cells do not have cell walls, which allows them to have more flexible shapes.',
  },
  {
    type: 'Plant',
    image: PlantCell,
    description:
      'Plant cells are eukaryotic cells distinguished by a rigid cell wall made of cellulose that provides structure and support. They contain a true nucleus and membrane-bound organelles.',
    fact: 'Plant cells have chloroplasts, which allow them to perform photosynthesis.',
  },
  {
    type: 'Fungal',
    image: FungalCell,
    description:
      'Fungal cells are eukaryotic cells characterized by a rigid cell wall made primarily of chitin, which provides structural support and protection.',
    fact: 'Fungal cells can be unicellular or multicellular and play important roles in decomposition.',
  },
  {
    type: 'Protist',
    image: ProtistCell,
    description:
      'Protist cells are eukaryotic and highly diverse, ranging from single-celled organisms to simple multicellular forms. They have a true nucleus and membrane-bound organelles.',
    fact: 'Protist cells can be autotrophic or heterotrophic and play vital roles in aquatic ecosystems.',
  },
];

export default cellTypeData;
