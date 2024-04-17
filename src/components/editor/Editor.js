import PropTypes from 'prop-types';
import '../../utils/highlight';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import { StyledEditor } from './styles';
import EditorToolbar, { formats } from './EditorToolbar';

// ----------------------------------------------------------------------

Editor.propTypes = {
  id: PropTypes.string,
  sx: PropTypes.object,
  error: PropTypes.bool,
  simple: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
  helperText: PropTypes.object,
};

export default function Editor({
  id = 'minimal-quill',
  error,
  value,
  onChange,
  simple = false,
  helperText,
  sx,
  ...other
}) {
  const modules = {
    toolbar: {
      container: `#${id}`,
    },
    history: {
      delay: 500,
      maxStack: 100,
      userOnly: true,
    },
    syntax: true,
    clipboard: {
      matchVisual: false,
    },
  };

  return (
    <>
      <StyledEditor
        sx={{
          ...(error && {
            border: (theme) => `solid 1px ${theme.palette.error.main}`,
          }),
          ...sx,
        }}
      >
        <EditorToolbar id={id} isSimple={simple} />

        <ReactQuill
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder="Write something awesome..."
          {...other}
        />
      </StyledEditor>

      {helperText && helperText}
    </>
  );
}


// import React from 'react';
// import PropTypes from 'prop-types';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css'; 




// const RichTextEditor = ({ value, onChange  }) => {
  

//   RichTextEditor.propTypes = {
//     value: PropTypes.string,
//     onChange: PropTypes.func,
//   };

//   const modules = {
//     toolbar: [
//       [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
//       ['bold', 'italic', 'underline', 'strike', 'blockquote'],
//       [{ 'color': [] }, { 'background': [] }],
//       [{ 'list': 'ordered' }, { 'list': 'bullet' }],
//       ['link', 'image', 'video'],
//       ['align', 'direction'],
//       ['code-block', 'formula', 'blockquote'],
//       ['clean']
//     ],
//   };

//   const formats = [
//     "align",
//     "background",
//     "blockquote",
//     "bold",
//     "bullet",
//     "code",
//     "code-block",
//     "color",
//     "direction",
//     "font",
//     "formula",
//     "header",
//     "image",
//     "indent",
//     "italic",
//     "link",
//     "list",
//     "script",
//     "size",
//     "strike",
//     "table",
//     "underline",
//     "video",
//   ];

//   return (
//     <div>
      
//       <ReactQuill
//         value={value} 
//         onChange={onChange} 
//         modules={modules}
//         formats={formats}
//       />
//     </div>
//   );
// };

// export default RichTextEditor;
