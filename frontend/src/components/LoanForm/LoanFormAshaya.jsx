const response = await fetch(`http://192.168.10.3/api/resource/Corporate?fields=["name","company_name","authorized_email","docstatus","owner"]`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "Cookie": `sid=bbc62a96cd456056cdfcbb683a99c8ce80dd2f30329cfa138518e82a; system_user=yes; full_name=Administrator; user_id=Administrator`,
  },
});