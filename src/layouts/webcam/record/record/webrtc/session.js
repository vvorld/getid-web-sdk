/* eslint-disable no-restricted-syntax */
class RecordSession {
  constructor(servers) {
    this.servers = servers;
    this.id = null;
  }

    call = async (method, location, data) => {
      for (const server of this.servers) {
        try {
          const json = await fetch(`${server}${location}`, {
            method,
            body: JSON.stringify(data),
            mode: 'cors',
            credentials: 'omit',
            headers: {
              'Content-Type': 'application/json',
            },
          }).then((r) => r.json());
          this.server = server;
          return json;
        } catch (e) {
          console.error(e);
        }
      }
      throw new Error('all fallback servers are unavailable');
    }

    initSession = (duration) => this.call('POST', '/connections', { duration }).then((data) => {
      this.id = data.id;
      return data;
    })

    remoteDescription = (localDescription) => this.call('POST', `/connections/${this.id}/remote-description`, localDescription)

    stopRecord = () => this.call('DELETE', `/connections/${this.id}`).catch(() => {})

    loadRecord = () => fetch(`${this.server}/files/${this.id}`, { method: 'GET', mode: 'cors', credentials: 'omit' }).then((x) => {
      if (x.status !== 200) {
        return null;
      }
      return x.blob();
    })
}

export default RecordSession;
