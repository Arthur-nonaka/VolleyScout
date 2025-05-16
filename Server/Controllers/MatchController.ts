import MatchModel from "../Models/MatchModel";

export default class MatchController {
  public static async getMatches() {
    try {
      const matches = await MatchModel.find();
      return matches;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
      } else {
        console.error(`Error: ${String(error)}`);
      }
      throw error;
    }
  }

  public static async getMatchById(id: string) {
    try {
      const match = await MatchModel.findById(id);
      if (!match) {
        throw new Error("Match not found");
      }
      return match;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
      } else {
        console.error(`Error: ${String(error)}`);
      }
      throw error;
    }
  }

  public static async createMatch(name: string, actions: string) {
    try {
      const match = new MatchModel({ name, actions });
      await match.save();
      return match;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
      } else {
        console.error(`Error: ${String(error)}`);
      }
      throw error;
    }
  }

  public static async updateMatch(id: string, name: string, actions: string) {
    try {
      const match = await MatchModel.findByIdAndUpdate(
        id,
        { name, actions },
        { new: true }
      );
      return match;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
      } else {
        console.error(`Error: ${String(error)}`);
      }
      throw error;
    }
  }

  public static async deleteMatch(id: string) {
    try {
      const match = await MatchModel.findByIdAndDelete(id);
      return match;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
      } else {
        console.error(`Error: ${String(error)}`);
      }
      throw error;
    }
  }
}
