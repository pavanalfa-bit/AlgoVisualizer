import React from 'react';
import { ArrowLeft } from 'lucide-react';
import TwoSum from './animations/TwoSum';
import ContainerWater from './animations/ContainerWater';
import TrappingRain from './animations/TrappingRain';
import { SpiralMatrix } from './animations/SpiralMatrix';
import { SpiralMatrix2 } from './animations/SpiralMatrix2';
import { SetMatrixZeroes } from './animations/SetMatrixZeroes';
import { RotateImage } from './animations/RotateImage';
import BinarySearch from './animations/BinarySearch';
import SearchInsertPosition from './animations/SearchInsertPosition';
import MissingNumber from './animations/MissingNumber';
import FindFirstAndLastPosition from './animations/FindFirstAndLastPosition';
import FindPeakElement from './animations/FindPeakElement';
import FindMinimumInRotatedSortedArray from './animations/FindMinimumInRotatedSortedArray';
import SearchInRotatedSortedArray from './animations/SearchInRotatedSortedArray';
import SearchInRotatedSortedArrayII from './animations/SearchInRotatedSortedArrayII';
import KokoEatingBananas from './animations/KokoEatingBananas';
import CapacityToShipPackages from './animations/CapacityToShipPackages';
import SplitArrayLargestSum from './animations/SplitArrayLargestSum';
import AllocateMinimumPages from './animations/AllocateMinimumPages';
import PaintersPartitionProblem from './animations/PaintersPartitionProblem';
import MedianOfTwoSortedArrays from './animations/MedianOfTwoSortedArrays';
import { Search2DMatrix } from './animations/Search2DMatrix';
import { Search2DMatrix2 } from './animations/Search2DMatrix2';
import { GameOfLife } from './animations/GameOfLife';
import { NumberOfIslands } from './animations/NumberOfIslands';
import { WordSearch } from './animations/WordSearch';
import { ValidSudoku } from './animations/ValidSudoku';
import { ConcatenationOfArray } from './animations/ConcatenationOfArray';
import { RunningSum } from './animations/RunningSum';
import { RichestCustomerWealth } from './animations/RichestCustomerWealth';
import { ShuffleArray } from './animations/ShuffleArray';
import { FlippingImage } from './animations/FlippingImage';
import { ClosestNumberToZero } from './animations/ClosestNumberToZero';
import MergeSortedArray from './animations/MergeSortedArray';
import RemoveDuplicates from './animations/RemoveDuplicates';
import SquaresSortedArray from './animations/SquaresSortedArray';
import ThreeSum from './animations/ThreeSum';
import TwoSumII from './animations/TwoSumII';
import MaximumSubarray from './animations/MaximumSubarray';
import BuyAndSellStock from './animations/BuyAndSellStock';
import LongestSubstring from './animations/LongestSubstring';
import CharacterReplacement from './animations/CharacterReplacement';
import MinimumWindowSubstring from './animations/MinimumWindowSubstring';
import PermutationInString from './animations/PermutationInString';
import FindAllAnagrams from './animations/FindAllAnagrams';
import ContainsDuplicate from './animations/ContainsDuplicate';
import FirstMissingPositive from './animations/FirstMissingPositive';
import IsomorphicStrings from './animations/IsomorphicStrings';
import ValidAnagram from './animations/ValidAnagram';
import GroupAnagrams from './animations/GroupAnagrams';
import MaximumNumberOfBalloons from './animations/MaximumNumberOfBalloons';
import RomanToInteger from './animations/RomanToInteger';
import LongestCommonPrefix from './animations/LongestCommonPrefix';
import EncodeDecodeStrings from './animations/EncodeDecodeStrings';
import ReverseString from './animations/ReverseString';
import ValidPalindrome from './animations/ValidPalindrome';
import ValidPalindromeII from './animations/ValidPalindromeII';
import LongestPalindromicSubstring from './animations/LongestPalindromicSubstring';
import PalindromicSubstrings from './animations/PalindromicSubstrings';
import NumberRecentCalls from './animations/NumberRecentCalls';
import StudentsUnableToEat from './animations/StudentsUnableToEat';
import ImplementStackUsingQueues from './animations/ImplementStackUsingQueues';
import DesignCircularQueue from './animations/DesignCircularQueue';

interface VisualizerProps {
  problemId: string;
  onBack: () => void;
}

export function Visualizer({ problemId, onBack }: VisualizerProps) {
  const renderAnimation = () => {
    switch (problemId) {
      case 'two-sum':
        return <TwoSum onBack={onBack} />;
      case 'container-water':
        return <ContainerWater onBack={onBack} />;
      case 'trapping-rain':
        return <TrappingRain onBack={onBack} />;
      case '54':
        return <SpiralMatrix onBack={onBack} />;
      case '59':
        return <SpiralMatrix2 onBack={onBack} />;
      case '73':
        return <SetMatrixZeroes onBack={onBack} />;
      case '48':
        return <RotateImage onBack={onBack} />;
      case '704':
        return <BinarySearch onBack={onBack} />;
      case '35':
        return <SearchInsertPosition onBack={onBack} />;
      case '268':
        return <MissingNumber onBack={onBack} />;
      case '34':
        return <FindFirstAndLastPosition onBack={onBack} />;
      case '162':
        return <FindPeakElement onBack={onBack} />;
      case '153':
        return <FindMinimumInRotatedSortedArray onBack={onBack} />;
      case '33':
        return <SearchInRotatedSortedArray onBack={onBack} />;
      case '81':
        return <SearchInRotatedSortedArrayII onBack={onBack} />;
      case '875':
        return <KokoEatingBananas onBack={onBack} />;
      case '1011':
        return <CapacityToShipPackages onBack={onBack} />;
      case '410':
        return <SplitArrayLargestSum onBack={onBack} />;
      case 'gfg-allocate':
        return <AllocateMinimumPages onBack={onBack} />;
      case 'ib-painters':
        return <PaintersPartitionProblem onBack={onBack} />;
      case '4':
        return <MedianOfTwoSortedArrays onBack={onBack} />;
      case '74':
        return <Search2DMatrix onBack={onBack} />;
      case '240':
        return <Search2DMatrix2 onBack={onBack} />;
      case '289':
        return <GameOfLife onBack={onBack} />;
      case '200':
        return <NumberOfIslands onBack={onBack} />;
      case '79':
        return <WordSearch onBack={onBack} />;
      case '36':
        return <ValidSudoku onBack={onBack} />;
      case '1480':
        return <RunningSum onBack={onBack} />;
      case '1672':
        return <RichestCustomerWealth onBack={onBack} />;
      case '1470':
        return <ShuffleArray onBack={onBack} />;
      case '832':
        return <FlippingImage onBack={onBack} />;
      case '2239':
        return <ClosestNumberToZero onBack={onBack} />;
      case '1929':
        return <ConcatenationOfArray onBack={onBack} />;
      case '88':
        return <MergeSortedArray onBack={onBack} />;
      case '26':
        return <RemoveDuplicates onBack={onBack} />;
      case '977':
        return <SquaresSortedArray onBack={onBack} />;
      case '15':
        return <ThreeSum onBack={onBack} />;
      case '167':
        return <TwoSumII onBack={onBack} />;
      case '53':
        return <MaximumSubarray onBack={onBack} />;
      case '121':
        return <BuyAndSellStock onBack={onBack} />;
      case '3':
        return <LongestSubstring onBack={onBack} />;
      case '424':
        return <CharacterReplacement onBack={onBack} />;
      case '76':
        return <MinimumWindowSubstring onBack={onBack} />;
      case '567':
        return <PermutationInString onBack={onBack} />;
      case '438':
        return <FindAllAnagrams onBack={onBack} />;
      case '217':
        return <ContainsDuplicate onBack={onBack} />;
      case '41':
        return <FirstMissingPositive onBack={onBack} />;
      case '205':
        return <IsomorphicStrings onBack={onBack} />;
      case '242':
        return <ValidAnagram onBack={onBack} />;
      case '49':
        return <GroupAnagrams onBack={onBack} />;
      case '1189':
        return <MaximumNumberOfBalloons onBack={onBack} />;
      case '13':
        return <RomanToInteger onBack={onBack} />;
      case '14':
        return <LongestCommonPrefix onBack={onBack} />;
      case '271':
        return <EncodeDecodeStrings onBack={onBack} />;
      case '344':
        return <ReverseString onBack={onBack} />;
      case '125':
        return <ValidPalindrome onBack={onBack} />;
      case '680':
        return <ValidPalindromeII onBack={onBack} />;
      case '5':
        return <LongestPalindromicSubstring onBack={onBack} />;
      case '647':
        return <PalindromicSubstrings onBack={onBack} />;
      case '933':
        return <NumberRecentCalls onBack={onBack} />;
      case '1700':
        return <StudentsUnableToEat onBack={onBack} />;
      case '225':
        return <ImplementStackUsingQueues onBack={onBack} />;
      case '622':
        return <DesignCircularQueue onBack={onBack} />;
      // Future animations would go here
      default:
        return (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
            Animation for this problem is coming soon!
          </div>
        );
    }
  };

  // All custom UI visualizers take the full screen and render their own VPHeader with back button.
  const fullScreenLayoutIds = [
    '54', '59', '73', '48', '74', '240', '289', '200', '79', '36',
    '1480', '1672', '1470', '832', '2239', '1929', // Batch 1
    '88', '26', '977', '15', '167', // Batch 2
    'two-sum', 'container-water', 'trapping-rain', // Original retrofitted
    '53', '121', '3', '424', '76', '567', '438', // Sliding Window
    '217', '41', '205', '242', '49', '1189', // Hashing
    '13', '14', '271', '344', '125', '680', '5', '647', // Strings
    '933', '1700', '225', '622', // Queue
    '704', '35', '268', '34', '162', '153', '33', '81', '875', '1011', '410', 'gfg-allocate', 'ib-painters', '4' // Binary Search
  ];
  if (fullScreenLayoutIds.includes(problemId)) {
    return (
      <div style={{ flex: 1, height: 'calc(100vh - 60px)', overflow: 'hidden' }}>
        {renderAnimation()}
      </div>
    );
  }

  return (
    <main style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)' }}>
      <button 
        className="back-btn" 
        onClick={onBack}
        style={{ background: 'none', border: 'none', cursor: 'pointer', alignSelf: 'flex-start' }}
      >
        <ArrowLeft size={16} /> Back to Problems
      </button>
      
      <div style={{ flex: 1, minHeight: 0 }}>
        {renderAnimation()}
      </div>
    </main>
  );
}
