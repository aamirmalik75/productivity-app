import axios from 'axios';

export const last_opened = async (postfix, token, prefix = "menuItem") => {
  const t = new Date();
  console.log(new Date(t).toLocaleString())
  const response = await axios.post(import.meta.env.VITE_SERVER_URL + `/api/${prefix}/${postfix}/open`, {
    time: new Date(t).toLocaleString()
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

}
