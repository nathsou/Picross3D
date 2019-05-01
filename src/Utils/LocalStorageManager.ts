
export namespace localStorageManager {

    export function addResolvedPuzzle(puzzle_name: string): void {
        if (isPuzzleResolved(puzzle_name)) return;

        const resovled_puzzles = localStorage.getItem('resolved_puzzles');
        if (resovled_puzzles !== null) {
            localStorage.setItem(
                'resolved_puzzles',
                JSON.stringify(
                    JSON.parse(resovled_puzzles).push(puzzle_name)
                )
            );
        } else {
            localStorage.setItem('resolved_puzzles', JSON.stringify([puzzle_name]));
        }
    }

    export function isPuzzleResolved(puzzle_name: string): boolean {
        if (localStorage.getItem('resolved_puzzles') !== null) {
            return JSON.parse(localStorage.getItem('resolved_puzzles')).includes(puzzle_name);
        }

        return false;
    }
}