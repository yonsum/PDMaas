import React, {useContext, useMemo, useRef} from 'react';
import AceEditor from 'react-ace';

// eslint-disable-next-line import/no-extraneous-dependencies
import 'ace-builds/src-noconflict/mode-json';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'ace-builds/src-noconflict/snippets/json';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'ace-builds/src-noconflict/mode-java';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'ace-builds/src-noconflict/snippets/java';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'ace-builds/src-noconflict/theme-monokai';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'ace-builds/src-noconflict/mode-sql';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'ace-builds/src-noconflict/snippets/sql';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'ace-builds/src-noconflict/mode-markdown';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'ace-builds/src-noconflict/snippets/markdown';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'ace-builds/src-noconflict/ext-language_tools';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'ace-builds/src-noconflict/ext-searchbox';
import {PermissionContext, ViewContent} from '../../lib/context';
import {checkPermission} from '../../lib/permission';

export default React.memo(({mode = 'sql', theme = 'monokai', value, onChange,
                             height, width, focus, firstLine, readOnly, onLoad, blur, style,
                            nsKey}) => {
  const isView = useContext(ViewContent);
  const finalNsKey = nsKey || useContext(PermissionContext);
  const finalReadOnly = finalNsKey ? (!checkPermission(finalNsKey) || readOnly) : readOnly;
  const name = useMemo(() => Math.uuid(), []);
  const aceRef = useRef(null);
  const _onLoad = (ace) => {
    focus && ace.focus();
    firstLine && ace.selection.moveCursorTo(0, 0);
    onLoad && onLoad(ace);
  };
  const _onChange = (data) => {
    onChange && onChange({
      target: {
        value: data,
      },
    });
  };
  const _onKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.stopPropagation();
    }
  };
  const onBlur = (e) => {
    blur && blur(e, aceRef.current.editor);
  };
  return <div style={style} onKeyDown={_onKeyDown}>
    <AceEditor
      ref={aceRef}
      fontSize={14}
      height={height}
      width={width}
      mode={(mode || '').toLocaleLowerCase()}
      theme={theme}
      name={name}
      onChange={_onChange}
      value={value}
      enableBasicAutocompletion
      enableLiveAutocompletion
      onLoad={_onLoad}
      readOnly={finalReadOnly || isView}
      onBlur={onBlur}
    />
  </div>;
});
