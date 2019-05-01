import { PicrossGame } from "./PicrossGame";

document.body.style.margin = "0";
document.body.style.padding = "0";
document.documentElement.style.margin = "0";
document.documentElement.style.padding = "0";

document.body.append(PicrossGame.getInstance().domElement);

/*
    TODO:
 - Compress JSON representation (run-box encoding + array with indices of used hints)
 - Build Puzzle mode -> add cells to satisfy hints instead of erasing cells
 - Puzzle history timeline
 - Puzzle Editor (add color? + GUI, Select mode to rotate and move a selection)
 - Save unfinished puzzle state (WebStorage)
 - Alert when an incorrect cell deletion occurs
 - Google / Facebook auth to save progression
 - Collections (Set of related objects solved separately, then put together in a 3D scene when all individual puzzle is resolved)
 - Export / Import puzzles using QR codes
 - Genetic algoithm to remove hints?
 - Offer possibility to solve 2D slices of a puzzle (classical 2D Picross)
 - Export puzzle as .OBJ or JSON
 - Web workers
 - Manage state with redux
 - https://webpbn.com/survey/caching.html

 FIXME:
  - Update hints on placeCell

 */