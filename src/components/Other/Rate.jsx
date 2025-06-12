import React from "react";
import { Star } from "@phosphor-icons/react"; // standard React build, not SSR

const Rate = ({ currentRate, size }) => {
  const arrOfStar = [];

  for (let i = 0; i < 5; i++) {
    if (currentRate !== undefined) {
      arrOfStar.push(
        <Star
          key={i}
          size={size}
          color={i < currentRate ? "#ECB018" : "#9FA09C"}
          weight="fill"
        />
      );
    }
  }

  return <div className="rate flex">{arrOfStar}</div>;
};

export default Rate;
