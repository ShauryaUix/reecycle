export default function getFilterWithCol(
    filter,
    col,
    isExtra = false,
    xsOrder,
  ) {
    return [filter[0], {
      ...filter[1],
      col: {
        xs: { span: 24, order: xsOrder },
        lg: { span: col, order: 0 },
      },
      isExtra,
    }];
  }
  