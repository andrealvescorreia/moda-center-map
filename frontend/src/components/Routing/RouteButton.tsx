import { ButtonHTMLAttributes } from "react";

const RouteButton = ({...rest }: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      {...rest}
    >
      🚶‍♂️‍➡️ Rota
    </button>
  )
};

export default RouteButton;