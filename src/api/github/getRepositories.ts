import type { Repository } from "./Repository";

const headers: HeadersInit = {
  authorization: "Bearer " + "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",
};

const getLanguagesForRepository = async (repository: Repository) => {
  const res = await fetch(repository.languages_url, {
    headers,
  });

  if (!res.ok) {
    console.log(res.url, res.status, res.statusText);

    return {};
  }

  return (await res.json()) as Record<string, number>;
};

export const getRepositories = async (): Promise<
  (Repository & { languages: Record<string, number> | undefined })[]
> => {
  const res = await fetch(
    "https://api.github.com/users/simon-debruijn/repos?type=owner&sort=created&per_page=15",
    {
      headers,
    }
  );

  if (!res.ok) {
    console.log(res.url, res.status, res.statusText);

    return [];
  }

  const repositories = (await res.json()) as Repository[];

  return await Promise.all(
    repositories
      .filter((repo) => !repo.fork)
      .map(async (repo) => {
        const languages = await getLanguagesForRepository(repo);

        return {
          ...repo,
          languages,
        };
      })
      .slice(0, 9)
  );
};
