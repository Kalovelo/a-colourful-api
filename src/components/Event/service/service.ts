import { bulkDelete, bulkUpload, uploadFile } from "../../../middleware/fileManager";
import { validateDBID } from "../../../utils/validate";
import GraphqlHTTPError from "../../../utils/GraphqlHTTPError";
import Topic from "../../Topic/model/Topic";
import Event from "../model/Event";
import { EventDocument } from "../model/interface";

export const addEvent = async (event: EventDocument) => {
  let { images, poster, primaryImage, ...rest } = event;
  if (event.images) images = await bulkUpload(event.images);
  poster = await uploadFile(event.poster);
  primaryImage = await uploadFile(event.primaryImage);
  return await Event.create({
    images,
    poster,
    primaryImage,
    ...rest,
  });
};

export const updateEvent = async (args: any) => {
  if (args.topic) {
    const topic = await Topic.findById(args.topic);
    if (!topic) throw new GraphqlHTTPError("Topic with specific id not found", 404);
  }
  if (args.images) args.images = await bulkUpload(args.images);
  if (args.poster) args.poster = await uploadFile(args.poster);
  if (args.primaryImage) args.primaryImage = await uploadFile(args.primaryImage);
  return await Event.findByIdAndUpdate(args.id, args, {
    new: true,
    runValidators: true,
  });
};

export const deleteEvent = async (id: string) => {
  if (!validateDBID(id)) throw new GraphqlHTTPError("Invalid ID", 400);
  const event = await Event.findByIdAndDelete(id);
  if (!event) throw new GraphqlHTTPError("Event with specific ID not found", 404);
  await bulkDelete([event!.primaryImage, event!.poster, ...event!.images]);
  return event;
};
