import request from "request-promise-native";
import fs from "fs";

// schedule post to fb page
export const postFbPhoto = (id: string, access_token: string) => (
  message: string,
  file: string,
  date: string
) =>
  request.post(
    {
      url: `https://graph.facebook.com/v4.0/${id}/photos`,
      formData: {
        published: "false",
        message,
        access_token,
        scheduled_publish_time: date,
        source: {
          value: fs.createReadStream(file),
          options: { contentType: "image/png" }
        }
      }
    },
    (_, __, body) => {
      console.log("Server responded with:", body);
    }
  );
