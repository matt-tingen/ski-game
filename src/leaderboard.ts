import { memoize } from 'es-toolkit';
import { rank } from './rank';

const nameStorageKey = 'name';
const dialog = document.getElementById(
  'leaderboard-container',
) as HTMLDialogElement;
const form = document.querySelector<HTMLFormElement>(
  '#leaderboard-container form',
)!;
const tableContainer = document.querySelector<HTMLFormElement>('#leaderboard')!;
const table = document.querySelector<HTMLFormElement>('#leaderboard table')!;
const tableBody = table.querySelector<HTMLFormElement>('tbody')!;
const nameInput = document.getElementById('name') as HTMLInputElement;

export const hideLeaderboard = () => {
  dialog.close();
};

const uploadScore = async (seed: string, name: string, ms: number) =>
  await fetch('/.netlify/functions/record', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'X-Please-Honor-System': 'I am not a cheater',
    },
    body: JSON.stringify({
      seed,
      name,
      ms,
    }),
  });

export const showLeaderboard = (seed: string, ms: number) => {
  let name = localStorage.getItem(nameStorageKey);

  const showTable = () => {
    const rows: LeaderboardRow[] = [
      ...(leaderboardCache.get(seed) ?? []),
      { name: name!, ms },
    ];

    populateLeaderboard(rows);
    tableContainer.classList.remove('hidden');
  };

  if (name) {
    showTable();
  } else {
    form.classList.remove('hidden');
  }

  dialog.show();

  nameInput.addEventListener('input', () => {
    nameInput.classList.remove('is-error');
  });

  const upload = () => uploadScore(seed, name!, ms);

  const onSubmit = (event: SubmitEvent) => {
    event.preventDefault();

    const nameValue = nameInput.value;

    if (!nameValue.length || nameValue.length > 50) {
      nameInput.classList.add('is-error');

      return;
    }

    localStorage.setItem(nameStorageKey, nameValue);
    form.classList.add('hidden');
    showTable();
    name = nameValue;
    upload();
  };

  form.addEventListener('submit', onSubmit);
  dialog.addEventListener('close', () => {
    form.removeEventListener('submit', onSubmit);
  });
};

interface LeaderboardRow {
  name: string;
  ms: number;
}

export const populateLeaderboard = (rows: LeaderboardRow[]) => {
  tableBody.innerHTML = '';

  const sorted = rank(
    rows,
    [[(r) => r.ms, 'asc']],
    [[(r) => r.name, 'asc']],
    ({ name, ms }, rank) => [rank, name, (ms / 1000).toFixed(2)] as const,
  );

  tableBody.append(
    ...sorted.map((data) => {
      const tr = document.createElement('tr');

      tr.append(
        ...data.map((datum) => {
          const td = document.createElement('td');

          td.textContent = datum.toString();

          return td;
        }),
      );

      return tr;
    }),
  );
};

const leaderboardCache = new Map<string, LeaderboardRow[]>();

export const fetchLeaderboard = memoize(async (seed: string) => {
  const response = await fetch(
    `/.netlify/functions/leaderboard?seed=${encodeURIComponent(seed)}`,
  );

  const json = await response.json();
  const rows = json as LeaderboardRow[];

  leaderboardCache.set(seed, rows);

  return rows;
});
