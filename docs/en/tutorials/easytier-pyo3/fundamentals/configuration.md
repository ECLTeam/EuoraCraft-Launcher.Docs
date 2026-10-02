---
title: Node Configuration in Depth
createTime: 2026/10/02 00:30:00
permalink: /en/tutorials/easytier-pyo3/fundamentals/configuration/
---

# Node Configuration in Depth

The previous chapter got a minimal node running. This one takes `Node()` apart: **what you can write, what it does, what the defaults are, and what can be changed later**. Once this is clear, you understand half of EasyTier-PyO3.

::: tip One rule of thumb
Configuration fields **match the `easytier-core` config file**. Field names you learn from the upstream EasyTier documentation can almost always be used as-is — except for the few differences called out below.
:::

---

## 1. Two ways to write a config

The first argument of `Node()` is `config`, and it accepts two forms.

### Form 1: a Python `dict` (recommended)

```python
from easytier_pyo3 import Node

node = Node({
    "instance_name": "node-a",
    "network_identity": {"network_name": "my-net", "network_secret": "topsecret"},
    "ipv4": "10.144.144.1/24",
    "listeners": ["tcp://0.0.0.0:11010"],
})
```

> 💡 `None` values inside the `dict` are **ignored**, which means "leave this field unset". So you can safely write:
> ```python
> Node({"ipv4": user_input_or_none, "hostname": config.get("hostname")})
> ```

### Form 2: a TOML string

```python
node = Node("""
instance_name = "node-a"
ipv4 = "10.144.144.1/24"
listeners = ["tcp://0.0.0.0:11010"]

[network_identity]
network_name = "my-net"
network_secret = "topsecret"
""")
```

TOML is convenient when you already have an EasyTier config file lying around:

```python
from pathlib import Path

node = Node(Path("easytier.toml").read_text(encoding="utf-8"))
```

The two forms are **interchangeable**: `apply_config()` also accepts both `dict` and TOML strings.

> ⚠️ A `dict` is converted to TOML, so keys must be valid TOML identifiers (letters, digits, underscores). Do not use hyphenated keys such as `network-identity`.

---

## 2. Network identity: who belongs to which network

```python
"network_identity": {"network_name": "my-net", "network_secret": "topsecret"}
```

These two values are the **single most important** part of the config:

| Key | Purpose | Default |
|-----|---------|---------|
| `network_name` | Network name, the identifier of one network | `"default"` |
| `network_secret` | Network secret, used for authentication and encryption | `""` (empty) |

The rule is simple:

- **Same `network_name` + same `network_secret`** → the same virtual network, peers can find each other.
- Anything else → two different networks that will **never see each other**, usually without a clear error.

Because this decides discovery, real deployments should:

1. Use a long random `network_secret`, never `test` / `123456`;
2. Not hand the network secret to temporary guests at all — issue an **access credential** instead (`generate_credential()`, covered in chapter 3), which can expire and be revoked.

> 📝 There is also a `secure_mode` field (private/public key) for stronger host identity checks. Add it when you need it; `network_secret` is enough for everyday use.

---

## 3. Virtual addresses: what I am called inside the network

| Field | Type | Notes |
|-------|------|-------|
| `ipv4` | str | Virtual IPv4 address, e.g. `10.144.144.1/24` |
| `ipv6` | str | Virtual IPv6 address, e.g. `fd00::1/64` |
| `dhcp` | bool | Let the network assign an IPv4 address (default `false`) |

Practical details:

- **Machines meant to reach each other must share a subnet.** `10.144.144.1/24` and `10.144.144.2/24` are a pair; `/24` means the first three octets are the network number.
- Writing `/32` is **silently treated as `/24`** (a lenient rule for single-host style configs), so do not rely on `/32` for point-to-point addressing.
- **You can omit `ipv4` entirely.** The node still discovers peers, forms tunnels and reports routes — it just has no fixed address in the network (perfectly normal in `no_tun` test mode). Port forwarding and pinging virtual IPs do require it.
- `dhcp = true` lets the network assign the address, useful when you would rather not manage address collisions.

IPv6 public-address fields (`ipv6_public_addr_provider` / `ipv6_public_addr_auto` / `ipv6_public_addr_prefix`) only matter when you own a public IPv6 block and want to hand out addresses. Leave them unset otherwise.

---

## 4. Listeners and peers: how others find me / how I find others

### `listeners` — addresses I listen on

```python
"listeners": ["tcp://0.0.0.0:11010", "udp://0.0.0.0:11010"]
```

::: warning The biggest difference from the CLI
**With no `listeners` configured, the node listens on nothing.**

The EasyTier CLI defaults to port `11010`, but this library **does not go through the CLI**, so that implicit default does not exist. The symptom of forgetting `listeners` is "everything looks fine, but nobody can connect" — check this first when debugging.
:::

Listening is optional: a node that only makes **outbound** connections (a pure client) does not need `listeners`.

`mapped_listeners` covers the case where you have port-forwarded through NAT or a firewall and want peers to reach you at a public address:

```python
"mapped_listeners": ["tcp://203.0.113.7:11010"]
```

Unlike `listeners`, it does not actually bind a socket — it only **tells peers what I look like from the outside**.

### `peer` — who I connect to

```python
"peer": [
    {"uri": "tcp://10.0.0.5:11010"},
    {"uri": "tcp://example.com:11010", "peer_public_key": "..."},
]
```

- `uri` is an address the node attempts to reach at startup. Because mesh discovery propagates, connecting to **any single node** in the network is enough to learn about the rest, so listing every peer is unnecessary.
- `peer_public_key` is optional and pinpoints the peer identity.
- **To add or remove peers at runtime, do not use `apply_config`** — use `add_connector()` / `remove_connector()`, covered in the [next chapter](/en/tutorials/easytier-pyo3/fundamentals/node-runtime/).

Transport prefixes such as `tcp://` and `udp://` behave the same as in the EasyTier CLI.

---

## 5. `flags`: behaviour switches

`flags` is a large `dict`, and **anything you omit falls back to its default**. The tables below are ordered from most-used to rarely-touched; all defaults come from `easytier-core`.

### The ones you actually touch

| Field | Default | When to change it |
|-------|---------|-------------------|
| `no_tun` | `false` | Set to `true` for connectivity tests, or when a TUN device is unavailable |
| `bind_device` | `true` | **Must be set to `false` together with `no_tun = true`**, otherwise connections fail with `WSAEADDRNOTAVAIL(10049)` |
| `mtu` | `1380` | Tune when large packets misbehave or the link MTU is unusual |
| `enable_encryption` | `true` | Only disable if you explicitly do not want encryption (not advised) |
| `encryption_algorithm` | `"aes-gcm"` | One of `aes-gcm` / `aes-256-gcm` / `chacha20` / `xor` |
| `latency_first` | `false` | Prefer low latency over throughput (worth enabling for gaming) |
| `default_protocol` | `"tcp"` | Change the default tunnel protocol, e.g. to `"udp"` |
| `dev_name` | `""` | Name the TUN interface for easier identification (on Windows it looks like `et_*`) |

### Hole punching and relaying

| Field | Default | Notes |
|-------|---------|-------|
| `disable_p2p` | `false` | Disable P2P direct connections; everything goes through relays |
| `p2p_only` | `false` | Allow P2P only, no relaying |
| `lazy_p2p` | `false` | Start relayed, attempt hole punching when latency is high |
| `disable_tcp_hole_punching` | `false` | Disable TCP hole punching |
| `disable_udp_hole_punching` | `false` | Disable UDP hole punching |
| `disable_sym_hole_punching` | `false` | Disable symmetric-NAT hole punching |
| `disable_upnp` | `false` | Disable UPnP port mapping |
| `need_p2p` | `false` | Require P2P to succeed, otherwise treat the peer as unusable |
| `relay_network_whitelist` | `"*"` | Networks this node may relay for |
| `relay_all_peer_rpc` | `false` | Relay all peer RPC |
| `disable_relay_data` | `false` | Disable data relaying (**the only `flags` field `apply_config` can change**) |

### Performance, compression and rate limits

| Field | Default | Notes |
|-------|---------|-------|
| `multi_thread` | `true` | Multi-threaded mode |
| `multi_thread_count` | `2` | Worker thread count |
| `data_compress_algo` | none | e.g. `"zstd"` |
| `instance_recv_bps_limit` | unlimited | Ingress rate limit (B/s) |
| `foreign_relay_bps_limit` | unlimited | Relay rate limit for foreign networks (B/s) |

### Everything else (look it up when needed)

`enable_exit_node` (act as an exit node), `proxy_forward_by_system` (system-level proxy forwarding), `use_smoltcp` (user-space stack), `enable_ipv6` (default `true`), `accept_dns`, `private_mode`, `enable_udp_broadcast_relay` (UDP broadcast relaying, useful for LAN game discovery), `tld_dns_zone` (default `"et.net."`), plus the KCP / QUIC groups (`enable_kcp_proxy`, `enable_quic_proxy`, `quic_listen_port`, …).

> 📝 **STUN servers**: `stun_servers` / `tcp_stun_servers` / `stun_servers_v6` default to built-in public servers (such as `stun.easytier.cn` and `stun.miwifi.com`). Only configure your own when those are unreachable (fully isolated networks, or you want that traffic on your own infrastructure).

---

## 6. Field reference

Top-level `Node()` fields at a glance. The `apply_config` column says whether the field can be changed at runtime on a running node.

| Field | Type | Default | apply_config | Notes |
|-------|------|---------|--------------|-------|
| `instance_name` | str | `"default"` | — | Display name |
| `instance_id` | str(UUID) | random UUID v4 | — | Node ID; usually omitted |
| `hostname` | str | empty | ✓ | Hostname, equivalent to CLI `--hostname` |
| `netns` | str | unset | — | Network namespace (Linux only) |
| `ipv4` / `ipv6` | str | unassigned | ✓ | Virtual addresses |
| `dhcp` | bool | `false` | — | DHCP-assigned IPv4 |
| `network_identity` | dict | `default` / empty secret | — | Network identity |
| `listeners` | list[str] | **empty (no listening)** | — | Listen addresses |
| `mapped_listeners` | list[str] | empty | ✓ | Public addresses announced to peers |
| `peer` | list[dict] | empty | — | Startup peers; use `add_connector()` at runtime |
| `routes` | list[str] | empty | ✓ | Advertised route CIDRs |
| `proxy_network` | list[dict] | empty | ✓ | Proxied subnets `{"cidr": ..., "allow": [...]}` |
| `exit_nodes` | list[str] | empty | ✓ | Exit node IPs |
| `port_forward` | list[dict] | empty | ✓ | Port forwarding rules |
| `acl` | dict | unset (allow all) | ✓ | ACL rules |
| `tcp_whitelist` / `udp_whitelist` | list[str] | empty | ✓ | ACL port whitelists |
| `socks5_proxy` | str | disabled | — | SOCKS5 proxy |
| `vpn_portal_config` | dict | disabled | — | VPN Portal (WireGuard client access) |
| `secure_mode` | dict | disabled | — | Private/public key mode |
| `credential_file` | str | unset | — | Credential file path |
| `stun_servers` etc. | list[str] | built-in public servers | — | Custom STUN |
| `flags` | dict | see above | only `disable_relay_data` | Behaviour switches |

---

## 7. `apply_config()`: reconfiguring at runtime

Once a node is running, much of the configuration can still change — **without restarting it**:

```python
node = Node({
    "network_identity": {"network_name": "net1", "network_secret": "secret"},
    "ipv4": "10.144.144.1/24",
})
node.start()

# Add one forwarding rule: local 8080 -> port 80 on virtual IP 10.144.144.2
node.apply_config({
    "port_forward": [
        {"bind_addr": "127.0.0.1:8080", "dst_addr": "10.144.144.2:80", "proto": "tcp"},
    ],
})

# Full replacement: the previous rule is cleared, only this one remains
node.apply_config({
    "port_forward": [
        {"bind_addr": "0.0.0.0:9090", "dst_addr": "10.144.144.3:3306", "proto": "tcp"},
    ],
})

# Clear every forwarding rule
node.apply_config({"port_forward": []})
```

### Two semantics worth memorising

1. **Only explicitly present fields are overwritten.** `apply_config({"hostname": "x"})` changes `hostname` and leaves everything else untouched.
2. **Collection fields are replaced wholesale, not appended.** `port_forward` / `routes` / `exit_nodes` / `proxy_network` / `mapped_listeners` / ACL whitelists all behave this way. To "add one rule", build the complete list first (from the current rules or your own state) and send it in one call.

### What `apply_config` cannot change

These fields are fixed at **startup** and cannot be changed on a running node (writing them has no effect):

- `instance_name` / `instance_id` / `network_identity` / `listeners` / `netns`
- `dhcp` / `credential_file` / `secure_mode` / `vpn_portal_config` / `socks5_proxy` / the `stun_servers` family
- **every** `flags` field except `disable_relay_data` (`no_tun`, `mtu`, `bind_device`, the hole-punching switches, …)

> ⚠️ **`apply_config()` requires the node to be `Running`.** Calls from `Created` / `Stopped` fail, and `peer` is not managed this way — use `add_connector()` / `remove_connector()` / `clear_connectors()` instead.
>
> Also note that internally `apply_config` translates the config into a sequence of runtime commands, so **multiple rules in a single call are not guaranteed to apply atomically**. Do not treat it as a transaction.

---

## 8. Summary

- Config is a `dict` or a TOML string with the same field names as `easytier-core`; `None` values are ignored.
- **`network_identity` decides whether peers can discover each other**, and `listeners` decides whether they can reach you (empty by default!).
- Every `flags` field has a default; newcomers should care most about the `no_tun` + `bind_device` pair.
- At runtime use `apply_config()` — remembering "only explicit fields" plus "collections are replaced wholesale". Startup fields cannot be changed.

Next we look at the full node lifecycle and how to surface live state inside your program.
