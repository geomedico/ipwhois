import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IpInfo extends Document {
  ip: string;
  success: boolean;
  type: string;
  continent: string;
  continent_code: string;
  country: string;
  country_code: string;
  country_flag: string;
  country_capital: string;
  country_phone: string;
  country_neighbours: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  asn: string;
  org: string;
  isp: string;
  timezone: string;
  timezone_gmt: string;
  currency: string;
  currency_code: string;
}

const IpSchema: Schema<IpInfo> = new Schema(
  {
    ip: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    success: { type: Boolean, required: true },
    type: { type: String, required: true },
    continent_code: { type: String, required: true },
    country: { type: String, required: true, index: true },
    country_code: { type: String, required: true },
    country_flag: { type: String, required: true },
    country_capital: { type: String, required: true },
    country_phone: { type: String, required: true },
    country_neighbours: { type: String, required: true },
    region: { type: String, required: true },
    city: { type: String, required: true },
    latitude: { type: Number },
    longitude: { type: Number },
    asn: { type: String, required: true, index: true },
    org: { type: String },
    isp: { type: String },
    timezone: { type: String },
    currency: { type: String, index: true },
    currency_code: { type: String },
  },
  {
    timestamps: true,
  }
);

export const IpModel: Model<IpInfo> = mongoose.model<IpInfo>(
  'IpInfo',
  IpSchema
);
