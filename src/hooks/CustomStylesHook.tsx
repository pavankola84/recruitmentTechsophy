import React, { useState, useEffect } from 'react';
import { css } from '@emotion/css';

interface Styles {
  [key: string]: any;
}

interface Theme {
  [key: string]: any;
}

const useCustomStyles = (styles: Styles | ((theme: Theme) => Styles), theme: Theme) => {
  const [classes, setClasses] = useState<{ [key: string]: string } | null>(null);

  useEffect(() => {
    if (!classes) {
      const evaluatedStyles = typeof styles === 'function' ? styles(theme) : styles;
      const generated: { [key: string]: string } = {};

      for (const key in evaluatedStyles) {
        if (evaluatedStyles.hasOwnProperty(key)) {
          generated[key] = css(evaluatedStyles[key]);
        }
      }

      setClasses(generated);
    }
  }, [styles, theme, classes]);

  return classes;
};

export default useCustomStyles;
