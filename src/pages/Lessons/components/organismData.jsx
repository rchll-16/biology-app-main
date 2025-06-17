// organismData.js
import Euglena from '../../../assets/images/euglena.png';
import Paramecium from '../../../assets/images/paramecium.png';
import Yeast from '../../../assets/images/yeast.png';
import Plants from '../../../assets/images/plants.png';
import Animals from '../../../assets/images/animals.png';
import Fungus from '../../../assets/images/fungus.png';

const organismData = {
  unicellular: [
    { name: 'Euglena', src: Euglena, fact: "Euglena can perform photosynthesis!" },
    { name: 'Paramecium', src: Paramecium, fact: "Paramecium move using cilia." },
    { name: 'Yeast', src: Yeast, fact: "Yeast is used in baking and brewing." }
  ],
  multicellular: [
    { name: 'Plants', src: Plants, fact: "Plants produce oxygen through photosynthesis." },
    { name: 'Animals', src: Animals, fact: "Animals are heterotrophic organisms." },
    { name: 'Fungus', src: Fungus, fact: "Fungi have cell walls made of chitin." }
  ]
};

export default organismData;
