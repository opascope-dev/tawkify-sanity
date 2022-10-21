import sanityClient from "part:@sanity/base/client";

const client = sanityClient.withConfig({apiVersion: '2021-06-07'})
async function getBlock(id) {
  try {
    const block = await client.fetch(
      `*[_type == "questions_blocks" && _id == "${id}"][0]`
    );

    return block;
  } catch (error) {
    return error;
  }
}

export default getBlock;