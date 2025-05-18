import mongoose, { Schema, Document } from "mongoose";

export interface IMatch extends Document {
  name: string;
  actions: string;
  url: string;
}

const MatchSchema: Schema = new Schema({
  name: { type: String, required: true },
  actions: { type: String, required: true },
  url: { type: String, required: false },
});

export default mongoose.model<IMatch>("Match", MatchSchema);
