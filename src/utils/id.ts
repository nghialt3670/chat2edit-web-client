import ObjectID from "bson-objectid";

export function createBsonId(): string {
  return new ObjectID().toHexString();
}
