class RecordSession {
  constructor(host) {
    this.host = host;
    this.id = null;
  }

    call = (method, location, data) => fetch(`${this.host}${location}`, {
      method,
      body: JSON.stringify(data),
      mode: 'cors',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((r) => r.json())

    initSession = (duration) => this.call('POST', '/connections', { duration }).then((data) => {
      this.id = data.id;
      return data;
    })

    remoteDescription = (localDescription) => this.call('POST', `/connections/${this.id}/remote-description`, localDescription)

    stopRecord = () => this.call('DELETE', `/connections/${this.id}`)

    loadRecord = () => fetch(`${this.host}/files/${this.id}`, { method: 'GET', mode: 'cors', credentials: 'omit' }).then((x) => {
      if (x.status !== 200) {
        return null;
      }
      return x.blob();
    })
}

export default RecordSession;
