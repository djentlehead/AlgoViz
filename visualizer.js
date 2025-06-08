const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const speedSlider = document.getElementById("speedSlider");
const speedValue = document.getElementById("speedValue");

const bubbleBtn = document.getElementById("bubbleBtn");
const insertionBtn = document.getElementById("insertionBtn");
const selectionBtn = document.getElementById("selectionBtn");
const mergeBtn = document.getElementById("mergeBtn");
const quickBtn = document.getElementById("quickBtn");

const sortBtn = document.getElementById("sortBtn");
const randomBtn = document.getElementById("randomBtn");

const descriptionDiv = document.getElementById("algoDescription");

let array = [];
const arraySize = 60;

let sorting = false;
let algorithm = "bubble";

const algorithmDescriptions = {
  bubble:
    "Bubble Sort repeatedly swaps adjacent elements if they are in wrong order, pushing the largest values to the end.",
  insertion:
    "Insertion Sort builds the sorted array one item at a time by inserting each element into its correct position.",
  selection:
    "Selection Sort divides the array into sorted and unsorted parts, repeatedly selecting the smallest element from unsorted part.",
  merge:
    "Merge Sort divides the array into halves, recursively sorts them, then merges the sorted halves.",
  quick:
    "Quick Sort picks a pivot element, partitions the array into elements less and greater than pivot, then sorts recursively.",
};

speedValue.textContent = speedSlider.value;
speedSlider.oninput = () => {
  speedValue.textContent = speedSlider.value;
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function initArray() {
  array = [];
  for (let i = 0; i < arraySize; i++) {
    array.push(Math.floor(Math.random() * canvas.height));
  }
  drawArray();
}

function drawArray(highlightIndices = []) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const barWidth = canvas.width / array.length;
  for (let i = 0; i < array.length; i++) {
    ctx.fillStyle = highlightIndices.includes(i) ? "#1abc9c" : "#0078d7";
    ctx.fillRect(
      i * barWidth,
      canvas.height - array[i],
      barWidth - 2,
      array[i]
    );
  }
}

function updateAlgorithmDescription(algoKey) {
  descriptionDiv.textContent = algorithmDescriptions[algoKey] || "";
}

function selectAlgorithm(algoKey) {
  algorithm = algoKey;
  updateAlgorithmDescription(algoKey);
  [bubbleBtn, insertionBtn, selectionBtn, mergeBtn, quickBtn].forEach((btn) => {
    btn.classList.remove("selected");
  });
  switch (algoKey) {
    case "bubble":
      bubbleBtn.classList.add("selected");
      break;
    case "insertion":
      insertionBtn.classList.add("selected");
      break;
    case "selection":
      selectionBtn.classList.add("selected");
      break;
    case "merge":
      mergeBtn.classList.add("selected");
      break;
    case "quick":
      quickBtn.classList.add("selected");
      break;
  }
}

async function bubbleSort() {
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        drawArray([j, j + 1]);
        await sleep(110 - speedSlider.value);
      }
    }
  }
}

async function insertionSort() {
  const n = array.length;
  for (let i = 1; i < n; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      j--;
      drawArray([j + 1, i]);
      await sleep(110 - speedSlider.value);
    }
    array[j + 1] = key;
    drawArray([j + 1, i]);
    await sleep(110 - speedSlider.value);
  }
}

async function selectionSort() {
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (array[j] < array[minIdx]) minIdx = j;
      drawArray([i, j, minIdx]);
      await sleep(110 - speedSlider.value);
    }
    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      drawArray([i, minIdx]);
      await sleep(110 - speedSlider.value);
    }
  }
}

async function mergeSort() {
  async function merge(left, mid, right) {
    let n1 = mid - left + 1;
    let n2 = right - mid;

    let L = [],
      R = [];
    for (let i = 0; i < n1; i++) L[i] = array[left + i];
    for (let j = 0; j < n2; j++) R[j] = array[mid + 1 + j];

    let i = 0,
      j = 0,
      k = left;
    while (i < n1 && j < n2) {
      if (L[i] <= R[j]) {
        array[k] = L[i];
        i++;
      } else {
        array[k] = R[j];
        j++;
      }
      drawArray([k]);
      await sleep(110 - speedSlider.value);
      k++;
    }
    while (i < n1) {
      array[k] = L[i];
      i++;
      k++;
      drawArray([k]);
      await sleep(110 - speedSlider.value);
    }
    while (j < n2) {
      array[k] = R[j];
      j++;
      k++;
      drawArray([k]);
      await sleep(110 - speedSlider.value);
    }
  }

  async function mergeSortRec(left, right) {
    if (left >= right) return;
    let mid = Math.floor((left + right) / 2);
    await mergeSortRec(left, mid);
    await mergeSortRec(mid + 1, right);
    await merge(left, mid, right);
  }

  await mergeSortRec(0, array.length - 1);
}

async function quickSort() {
  async function partition(low, high) {
    let pivot = array[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (array[j] < pivot) {
        i++;
        [array[i], array[j]] = [array[j], array[i]];
        drawArray([i, j]);
        await sleep(110 - speedSlider.value);
      }
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    drawArray([i + 1, high]);
    await sleep(110 - speedSlider.value);
    return i + 1;
  }

  async function quickSortRec(low, high) {
    if (low < high) {
      let pi = await partition(low, high);
      await quickSortRec(low, pi - 1);
      await quickSortRec(pi + 1, high);
    }
  }

  await quickSortRec(0, array.length - 1);
}

async function startSort() {
  sorting = true;
  disableButtons(true);

  switch (algorithm) {
    case "bubble":
      await bubbleSort();
      break;
    case "insertion":
      await insertionSort();
      break;
    case "selection":
      await selectionSort();
      break;
    case "merge":
      await mergeSort();
      break;
    case "quick":
      await quickSort();
      break;
  }

  sorting = false;
  disableButtons(false);
}

function disableButtons(disable) {
  sortBtn.disabled = disable;
  randomBtn.disabled = disable;
  [bubbleBtn, insertionBtn, selectionBtn, mergeBtn, quickBtn].forEach(
    (btn) => (btn.disabled = disable)
  );
}

bubbleBtn.addEventListener("click", () => selectAlgorithm("bubble"));
insertionBtn.addEventListener("click", () => selectAlgorithm("insertion"));
selectionBtn.addEventListener("click", () => selectAlgorithm("selection"));
mergeBtn.addEventListener("click", () => selectAlgorithm("merge"));
quickBtn.addEventListener("click", () => selectAlgorithm("quick"));

sortBtn.addEventListener("click", () => {
  if (!sorting) startSort();
});

randomBtn.addEventListener("click", () => {
  if (!sorting) {
    initArray();
    updateAlgorithmDescription(algorithm);
  }
});

initArray();
updateAlgorithmDescription(algorithm);
