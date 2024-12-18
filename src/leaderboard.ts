import { groupBy, memoize, minBy } from 'es-toolkit';
import { BASE_FUNCTIONS_URL } from './netlify';
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
const closeBtn = document.getElementById('close') as HTMLButtonElement;

closeBtn.addEventListener('click', () => {
  dialog.close();
});

// Prevent interacting with the game while the dialog is open
dialog.addEventListener('keydown', (e) => {
  e.stopPropagation();
});

const uploadScore = async (seed: string, name: string, ms: number) => {
  if (!BASE_FUNCTIONS_URL) return;

  return await fetch(`${BASE_FUNCTIONS_URL}/record`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Anti-Cheat': 'please use the honor system',
    },
    body: JSON.stringify({
      seed,
      name,
      ms,
    }),
  });
};

const uniqRows = (rows: LeaderboardRow[]) => {
  const byName = groupBy(rows, (row) => row.name);

  return Object.entries(byName).map(
    ([name, rows]): LeaderboardRow => ({
      name,
      ms: minBy(rows, (r) => r.ms)!.ms,
    }),
  );
};

export const showLeaderboard = (seed: string, ms: number) => {
  let name = localStorage.getItem(nameStorageKey);

  const showTable = () => {
    populateLeaderboard(
      uniqRows([
        ...(leaderboardCache.get(seed) ?? []),
        {
          name: name!,
          ms,
        },
      ]),
      name!,
    );
    tableContainer.classList.remove('hidden');
  };

  const upload = () => uploadScore(seed, name!, ms);

  if (name) {
    upload();
    showTable();
  } else {
    form.classList.remove('hidden');
  }

  dialog.showModal();

  nameInput.addEventListener('input', () => {
    nameInput.classList.remove('is-error');
  });

  const onSubmit = (event: SubmitEvent) => {
    event.preventDefault();

    const nameValue = nameInput.value;

    if (!nameValue.length || nameValue.length > 50) {
      nameInput.classList.add('is-error');

      return;
    }

    localStorage.setItem(nameStorageKey, nameValue);
    form.classList.add('hidden');
    name = nameValue;
    showTable();
    void upload();

    setTimeout(() => {
      if (document.scrollingElement) {
        document.scrollingElement.scrollTop = 0;
      }
    }, 1);
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

export const populateLeaderboard = (
  rows: LeaderboardRow[],
  forceNameVisible: string,
) => {
  tableBody.innerHTML = '';

  const sorted = rank(
    rows,
    [[(r) => r.ms, 'asc']],
    [[(r) => r.name, 'asc']],
    ({ name, ms }, rank) => [rank, name, (ms / 1000).toFixed(2)] as const,
  );

  sorted.forEach((data, i) => {
    if (!(i < 10 || data[1] === forceNameVisible)) return;

    const tr = document.createElement('tr');

    tr.append(
      ...data.map((datum) => {
        const td = document.createElement('td');
        const span = document.createElement('span');

        span.textContent = datum.toString();
        td.append(span);

        return td;
      }),
    );

    tableBody.append(tr);
  });
};

const leaderboardCache = new Map<string, LeaderboardRow[]>();

export const fetchLeaderboard = memoize(async (seed: string) => {
  if (!BASE_FUNCTIONS_URL) return [];

  const response = await fetch(
    `${BASE_FUNCTIONS_URL}/leaderboard?seed=${encodeURIComponent(seed)}`,
  );

  const json = await response.json();
  const rows = json as LeaderboardRow[];

  leaderboardCache.set(seed, rows);

  return rows;
});

export const changeName = (name: unknown) => {
  if (typeof name === 'string' && name && name.length < 50) {
    localStorage.setItem(nameStorageKey, name);
    window.location.reload();
  } else {
    // eslint-disable-next-line no-console
    console.error('Invalid name');
  }
};
