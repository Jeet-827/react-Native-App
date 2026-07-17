import URL from "../model/urlModel.js";
import shortid from "shortid";
export const SortUrl = async (req,res)=>{
    try {
        const shortId = shortid.generate()
        const url = await URL.create({
            shortId,
            redirectUrl: req.body.url || req.body.redirectUrl || req.body.urlpath,
            historyClick:[]
        })
        res.status(200).json({message:"Url is genrated"})
    } catch (error) {
        console.log(error.message)   
    }
}
export const GetUrl = async (req, res) => {
  try {
    const { id } = req.params;

    const entry = await URL.findOneAndUpdate(
      { shortId: id },
      {
        $push: {
          historyClick: {
            timestamp: Date.now(),
          },
        },
      },
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({ message: "URL not found" });
    }

    res.redirect(entry.redirectUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};