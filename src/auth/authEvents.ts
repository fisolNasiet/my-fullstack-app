type Listener = () => void;

const logoutListeners = new Set<Listener>();

export const authEvents = {
  onLogout(listener: Listener): () => void {
    logoutListeners.add(listener);
    return () => logoutListeners.delete(listener);
  },
  emitLogout(): void {
    for (const listener of logoutListeners) listener();
  },
};
