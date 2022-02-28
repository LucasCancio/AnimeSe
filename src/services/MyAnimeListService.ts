import { api } from "./api";

interface IGenre {
  id: number;
  name: string;
}

interface IAnime {
  id: number;
  title: string;
  main_picture: {
    medium: string;
    large: string;
  };
  genres: IGenre[];
}

interface ISeasonResult {
  data: {
    node: IAnime;
  }[];
}

const now = new Date();

/*
    winter	January, February, March
    spring	April, May, June
    summer	July, August, September
    fall	October, November, December
*/

function GetSeasonByMonth(month: number) {
  switch (month) {
    case 0 || 1 || 2:
      return "winter";
    case 3 || 4 || 5:
      return "spring";
    case 6 || 7 || 8:
      return "summer";
    case 9 || 10 || 11:
      return "fall";
    default:
      throw new Error("Invalid month");
  }
}

class MyAnimeListService {
  async getSeasonAnime(
    year: number = null,
    month: number = null,
    season: string = null
  ) {
    if (!year) year = now.getFullYear();
    if (!season) season = GetSeasonByMonth(now.getMonth());

    const result = await api.get<ISeasonResult>(
      `anime/season/${year}/${season}`,
      {
        params: {
          limit: 100,
          sort: "anime_score",
          fields: ["title", "genres"].join(","),
        },
      }
    );

    return result.data;
  }
}

export { MyAnimeListService };
