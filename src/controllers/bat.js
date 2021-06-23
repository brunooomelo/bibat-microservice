const index = async (req, res) => {
  try {
    const {page = 1, limit = 10} = req.query;
    const data = await Bat.paginate(
      {},
      {
        page: parseInt(page),
        limit: parseInt(limit),
      }
    );
    res.json({bat: data});
  } catch (error) {
    res.json({error: error.message, type: error.name});
  }
};

const show = async (req, res) => {
  try {
    const {id} = req.params;
    const data = await Bat.findOne({_id: id});
    res.json({user: data});
  } catch (error) {
    res.json({error: error.message, type: error.name});
  }
};

const create = async (req, res) => async (req, res) => {
  try {
    await Bat.create({
      ...req.body,
      file: {...req.file},
      owner: req.owner,
    });
    res.json({message: 'arquivo cadastrado'});
  } catch (error) {
    res.json({error: error.message, type: error.name});
  }
};

const update = async (req, res) => {
  try {
    const {id} = req.params;
    const data = await Bat.updateOne({_id: id}, req.body);
    res.json({data});
  } catch (error) {
    res.json({error: error.message, type: error.name});
  }
};

const downloadFile = async (req, res) => {
  try {
    const {id} = req.params;
    const {file} = await Bat.findOne({_id: id});
    res.download(path.join(bat.folder, file.filename), file.originalname);
  } catch (error) {
    res.json({error: error.message, type: error.name});
  }
};
module.exports = {
  index,
  show,
  create,
  downloadFile,
  update,
};
