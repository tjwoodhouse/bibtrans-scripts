
async function fetchTSV(url) {
  try {
    const response = await fetch(url);
    const text = await response.text();
    const verseCounts = {};
    const lines = text.split('\n');
    for (const line of lines) {
      const [book, chapter, verses] = line.split('\t');
      if (!verseCounts[book]) {
        verseCounts[book] = {};
      }
      verseCounts[book][chapter] = parseInt(verses);
    }

    return verseCounts;    
  } catch (error) {
    console.error('Error fetching TSV:', error);
    return [];
  }
}
var verseCounts;
// Example usage:
const url = 'book_cpt_verse_counts.tsv';
fetchTSV(url)
  .then(data => {
    console.log(data); // Array of dictionaries
    verseCounts = data;
  })
  .catch(error => console.error(error));


function getAllChapters(book) {
  chapters = verseCounts[book];
  console.log(chapters);
  return Object.values(chapters).reduce((sval, x) => sval + x, 0);
  
}


function calculateVerses(reference) {
  const regex = /(\w+) (\d+):?(\d*)-?(\d+)?:?(\d*)?/g;
  let totalVerses = 0;
  let match;
  while ((match = regex.exec(reference)) !== null) {
    const book = match[1].toUpperCase();
    const startChapter = parseInt(match[2]);
    const startVerse = parseInt(match[3]) || 1;
    const endChapter = parseInt(match[4]) || startChapter;
    const endVerse = parseInt(match[5]) || Infinity;
    for (let chapter = startChapter; chapter <= endChapter; chapter++) {
      const chapterVerseCount = verseCounts[book][chapter];
      if (chapter === startChapter) {
        if (startVerse == 1){
          totalVerses += chapterVerseCount;
        } else {
          totalVerses += chapterVerseCount - startVerse + 1;
        }
      } else if (chapter === endChapter) {
        console.log("EC", endVerse, reference, match[5])
        if (parseInt(match[5]) != 0){
          totalVerses += Math.min(chapterVerseCount, endVerse);
        }
      } else {
        totalVerses += chapterVerseCount;
      }
    }
  }

  if (totalVerses == 0 && !reference.includes('-')) {
    return getAllChapters(reference);
  }
  return totalVerses;
}

// Example usage:
function calcTotals(tblock){
  const lines = tblock.split('\n')
  const chunks = lines.map(x => calculateVerses(x.trim()));
  return chunks.reduce((sval, x) => sval + x, 0);
  
}
