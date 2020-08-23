class Api {
  constructor(host) {
    this.host = host;
    this.id = null;
  }

    call = (method, location, data) => fetch(`${this.host}${location}`, {
      method,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((r) => r.json())

    initConnect = (duration) => this.call('POST', '/connections', { duration }).then((data) => {
      this.id = data.id;
      return data;
    })

    remoteDescription = (localDescription) => this.call('POST', `/connections/${this.id}/remote-description`, localDescription)

    stopRecord = () => this.call('DELETE', `/connections/${this.id}`)

    loadRecord = () => fetch(`${this.host}/files/${this.id}`, { method: 'GET' }).then((x) => {
      if (x.status !== 200) {
        return null;
      }
      return x.blob();
    })
}

export default Api;
