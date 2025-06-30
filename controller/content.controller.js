// controllers/contentController.js
const ContentModel = require('../model/content');

// CREATE
exports.addContent = async (req, res) => {
  try {
    const newContent = new ContentModel({ name: req.body.name });
    const saved = await newContent.save();
    console.log('Content is Stored Successfully');
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error storing content', error);
    res.status(500).json({ error: error.message });
  }
};

// READ ALL
exports.viewContents = async (req, res) => {
  try {
    const contents = await ContentModel.find();
    res.status(200).json({ status: 1, message: 'success', data: contents });
  } catch (error) {
    console.error('Error fetching contents', error);
    res.status(500).json({ error: error.message });
  }
};

// READ ONE by ID
exports.viewContentById = async (req, res) => {
  const id = req.params.id.trim();
  try {
    const content = await ContentModel.findById(id);
    if (!content) {
      return res.status(404).json({ status: 0, error: 'Content not found' });
    }
    res.status(200).json({ status: 1, data: content });
  } catch (error) {
    console.error('Error fetching content by ID', error);
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
exports.updateContent = async (req, res) => {
  const id = req.params.id.trim();
  try {
    const updated = await ContentModel.findByIdAndUpdate(
      id,
      { name: req.body.name },
      { new: true, runValidators: true },
    );
    if (!updated) {
      return res.status(404).json({ error: 'Content not found' });
    }
    console.log('Content Data is Updated Successfully');
    res
      .status(200)
      .json({ status: 1, message: 'Updated successfully', data: updated });
  } catch (error) {
    console.error('Error updating content', error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE
exports.deleteContent = async (req, res) => {
  const id = req.params.id.trim();
  try {
    const deleted = await ContentModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Content not found' });
    }
    res
      .status(200)
      .json({ status: 1, message: 'Deleted successfully', data: deleted });
  } catch (error) {
    console.error('Error deleting content', error);
    res.status(500).json({ error: error.message });
  }
};
