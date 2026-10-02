---
title: 节点配置详解
createTime: 2026/10/02 00:30:00
permalink: /tutorials/easytier-pyo3/fundamentals/configuration/
---

# 节点配置详解

上一章你已经跑通了一个最小节点。这一章把 `Node()` 的配置拆开讲清楚：**能写什么、写了会怎样、默认值是多少、哪些能事后改**。看懂这一章，你就基本掌握了 EasyTier-PyO3 的一半。

::: tip 一句话原则
本库的配置字段**与 `easytier-core` 的配置文件保持一致**。你在 EasyTier 官方文档里学到的字段名，几乎可以原样搬过来 —— 除了下面会特别指出的几处差异。
:::

---

## 1. 配置的两种写法

`Node()` 的第一个参数是 `config`，接受两种形式：

### 形式一：Python `dict`（推荐）

```python
from easytier_pyo3 import Node

node = Node({
    "instance_name": "node-a",
    "network_identity": {"network_name": "my-net", "network_secret": "topsecret"},
    "ipv4": "10.144.144.1/24",
    "listeners": ["tcp://0.0.0.0:11010"],
})
```

> 💡 `dict` 里的 `None` 值会被**忽略**，等价于「不配置这个字段」。所以你可以放心地这样写：
> ```python
> Node({"ipv4": user_input_or_none, "hostname": config.get("hostname")})
> ```

### 形式二：TOML 字符串

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

什么时候用 TOML？当你已经有现成的 EasyTier 配置文件、想直接读文件喂进来的时候最方便：

```python
from pathlib import Path

node = Node(Path("easytier.toml").read_text(encoding="utf-8"))
```

两种写法**可以混用**：`apply_config()` 也同时接受 `dict` 和 TOML 字符串。

> ⚠️ 注意 `dict` 会被转成 TOML，所以键名必须符合 TOML 语法（纯字母数字下划线）。别用 `network-identity` 这种带连字符的键名。

---

## 2. 网络身份：决定「谁和谁是一张网」

```python
"network_identity": {"network_name": "my-net", "network_secret": "topsecret"}
```

这是整份配置里**最关键**的两项：

| 键 | 作用 | 默认值 |
|----|------|--------|
| `network_name` | 网络名，同一张网的标识 | `"default"` |
| `network_secret` | 网络密钥，参与鉴权与加密 | `""`（空） |

规则很简单：

- **`network_name` + `network_secret` 都相同** → 同一张虚拟网，能互相发现。
- 只要有一项不同 → 被当成两张不同的网，两边**永远看不到对方**，且不会有明显报错。

因为直接决定发现结果，实际部署时建议：

1. `network_secret` 用足够长的随机串，不要用 `test` / `123456`；
2. 需要给别人临时接入时，**不要**直接把网络密钥发出去，改用第 3 章的**接入凭证**（`generate_credential()`），可以设有效期、可吊销。

> 📝 另有一个 `secure_mode` 字段（私钥 / 公钥）用于更强的主机身份校验，需要时再上；日常用 `network_secret` 已经足够。

---

## 3. 虚拟地址：我在网里叫什么

| 字段 | 类型 | 说明 |
|------|------|------|
| `ipv4` | str | 虚拟 IPv4 地址，如 `10.144.144.1/24` |
| `ipv6` | str | 虚拟 IPv6 地址，如 `fd00::1/64` |
| `dhcp` | bool | 是否由网络里的 DHCP 自动分配 IPv4（默认 `false`） |

几个实用细节：

- **同网段的机器要配在同一子网**。`10.144.144.1/24` 和 `10.144.144.2/24` 是一对，`/24` 表示前三段是网络号。
- 写成 `/32` 会被**自动按 `/24` 处理**（这是为兼容单机写法做的宽松处理），所以别指望用 `/32` 做点对点地址。
- **不配 `ipv4` 也能跑**：节点仍然能发现对端、能建隧道、能看路由，只是自己在这张网里没有固定地址（在 `no_tun` 测试模式下这很正常）。要做端口转发 / ping 虚拟 IP，就得配。
- `dhcp = true` 时由网络分配地址，适合「不想管地址冲突」的场景。

IPv6 公网相关还有三个字段（`ipv6_public_addr_provider` / `ipv6_public_addr_auto` / `ipv6_public_addr_prefix`），只在你有公网 IPv6 段并想对外提供地址时才需要，一般留空。

---

## 4. 监听与对端：别人怎么找到我 / 我怎么找到别人

### `listeners` —— 我监听哪些地址

```python
"listeners": ["tcp://0.0.0.0:11010", "udp://0.0.0.0:11010"]
```

::: warning 本库与 CLI 最大的差异
**不配置 `listeners`，节点不会监听任何端口。**

EasyTier 的 CLI 默认监听 `11010`，而本库**不经过 CLI**，所以没有这个隐含默认值。忘了配 `listeners` 的表现是「运行正常，但对端连不上」，排查时优先检查这一项。
:::

不监听不等于不能用：只做**主动出站**连接的节点（只当客户端）可以不配 `listeners`。

`mapped_listeners` 用于你在 NAT/防火墙后面做了端口映射、想让别人用「公网地址」来连你的情况：

```python
"mapped_listeners": ["tcp://203.0.113.7:11010"]
```

它有别于 `listeners`：它不真正监听，只是**告诉对端我对外长什么样**。

### `peer` —— 我主动连谁

```python
"peer": [
    {"uri": "tcp://10.0.0.5:11010"},
    {"uri": "tcp://example.com:11010", "peer_public_key": "..."},
]
```

- `uri` 是启动期就尝试连接的对端地址。只要**网络里任意一个节点连上了**，就能通过它发现整张网的其他节点（mesh 的扩散特性），所以不需要把每个对端都列出来。
- `peer_public_key` 可选，用于校验对端身份。
- **想运行期动态加/删对端，不要用 `apply_config`**，用 `add_connector()` / `remove_connector()` —— 见 [下一章](/tutorials/easytier-pyo3/fundamentals/node-runtime/)。

传输协议前缀支持 `tcp://`、`udp://` 等，与 EasyTier CLI 一致。

---

## 5. `flags`：行为开关

`flags` 是一个大 `dict`，**没写的字段一律取默认值**。下面按「最常用 → 很少动」排，全部默认值取自 `easytier-core` 源码。

### 最常改的几个

| 字段 | 默认 | 什么时候改它 |
|------|------|-------------|
| `no_tun` | `false` | 只想测连通性 / 不想（或不能）创建 TUN 时设为 `true` |
| `bind_device` | `true` | **`no_tun = true` 时必须一起设成 `false`**，否则连接报 `WSAEADDRNOTAVAIL(10049)` |
| `mtu` | `1380` | 隧道里跑大包出问题、或链路 MTU 特殊时调整 |
| `enable_encryption` | `true` | 明确不要加密时才关（不建议） |
| `encryption_algorithm` | `"aes-gcm"` | 可选 `aes-gcm` / `aes-256-gcm` / `chacha20` / `xor` |
| `latency_first` | `false` | 更在意延迟而不是带宽时设为 `true`（游戏联机很值得开） |
| `default_protocol` | `"tcp"` | 改默认隧道协议，如 `"udp"` |
| `dev_name` | `""` | 指定 TUN 网卡名，方便识别（Windows 上形如 `et_*`） |

### 打洞与中继

| 字段 | 默认 | 说明 |
|------|------|------|
| `disable_p2p` | `false` | 禁用 P2P 直连，全部走中继 |
| `p2p_only` | `false` | 只允许 P2P，不许中继 |
| `lazy_p2p` | `false` | 先走中继，延迟高时再尝试打洞 |
| `disable_tcp_hole_punching` | `false` | 禁用 TCP 打洞 |
| `disable_udp_hole_punching` | `false` | 禁用 UDP 打洞 |
| `disable_sym_hole_punching` | `false` | 禁用对称型 NAT 打洞 |
| `disable_upnp` | `false` | 禁用 UPnP 自动端口映射 |
| `need_p2p` | `false` | 强制要求 P2P 成功，否则视为不可用 |
| `relay_network_whitelist` | `"*"` | 允许中继的网络白名单 |
| `relay_all_peer_rpc` | `false` | 中继所有对端 RPC |
| `disable_relay_data` | `false` | 禁用数据中继（**`flags` 里唯一可用 `apply_config` 改的字段**） |

### 性能、压缩与限速

| 字段 | 默认 | 说明 |
|------|------|------|
| `multi_thread` | `true` | 多线程模式 |
| `multi_thread_count` | `2` | 多线程线程数 |
| `data_compress_algo` | 无压缩 | 如 `"zstd"` |
| `instance_recv_bps_limit` | 不限速 | 本节点接收限速（B/s） |
| `foreign_relay_bps_limit` | 不限速 | 对外中继限速（B/s） |

### 其它（用到再查）

`enable_exit_node`（作为出口节点）、`proxy_forward_by_system`（系统级代理转发）、`use_smoltcp`（用户态协议栈）、`enable_ipv6`（默认 `true`）、`accept_dns`、`private_mode`、`enable_udp_broadcast_relay`（UDP 广播中继，局域网游戏发现有用）、`tld_dns_zone`（默认 `"et.net."`）、以及成组的 KCP / QUIC 开关（`enable_kcp_proxy`、`enable_quic_proxy`、`quic_listen_port` 等）。

> 📝 **STUN 服务器**：`stun_servers` / `tcp_stun_servers` / `stun_servers_v6` 默认使用内置公共服务器（如 `stun.easytier.cn`、`stun.miwifi.com` 等）。只有在这些服务器不可达（比如完全内网、或想让流量走自己的 STUN）时才需要自己配。

---

## 6. 常用字段速查表

下表是 `Node()` 的一级字段总览，`apply_config 覆盖` 一列表示能否在节点运行中用 `apply_config()` 修改。

| 字段 | 类型 | 默认值 | apply_config 覆盖 | 说明 |
|------|------|--------|-------------------|------|
| `instance_name` | str | `"default"` | — | 节点名称（显示用） |
| `instance_id` | str(UUID) | 自动生成 UUID v4 | — | 节点唯一 ID，一般不用写 |
| `hostname` | str | 空 | ✓ | 节点主机名，等价 CLI `--hostname` |
| `netns` | str | 未配置 | — | 网络命名空间（仅 Linux） |
| `ipv4` / `ipv6` | str | 未分配 | ✓ | 虚拟地址 |
| `dhcp` | bool | `false` | — | DHCP 分配 IPv4 |
| `network_identity` | dict | `default` / 空密钥 | — | 网络身份 |
| `listeners` | list[str] | **空（不监听）** | — | 监听地址 |
| `mapped_listeners` | list[str] | 空 | ✓ | 对外映射地址 |
| `peer` | list[dict] | 空 | — | 启动期对端，运行期用 `add_connector()` |
| `routes` | list[str] | 空 | ✓ | 通告的路由网段 |
| `proxy_network` | list[dict] | 空 | ✓ | 代理网段 `{"cidr": ..., "allow": [...]}` |
| `exit_nodes` | list[str] | 空 | ✓ | 出口节点 IP |
| `port_forward` | list[dict] | 空 | ✓ | 端口转发规则 |
| `acl` | dict | 未配置（放行全部） | ✓ | ACL 规则 |
| `tcp_whitelist` / `udp_whitelist` | list[str] | 空 | ✓ | ACL 端口白名单 |
| `socks5_proxy` | str | 不启用 | — | SOCKS5 代理 |
| `vpn_portal_config` | dict | 不启用 | — | VPN Portal（WireGuard 客户端接入） |
| `secure_mode` | dict | 不启用 | — | 私钥 / 公钥安全模式 |
| `credential_file` | str | 未配置 | — | 凭证文件路径 |
| `stun_servers` 等 | list[str] | 内置公共服务器 | — | 自定义 STUN |
| `flags` | dict | 见上一节 | 仅 `disable_relay_data` | 行为开关 |

---

## 7. `apply_config()`：运行期改配置

节点跑起来之后，很多配置仍然可以改，而且**不用重启节点**：

```python
node = Node({
    "network_identity": {"network_name": "net1", "network_secret": "secret"},
    "ipv4": "10.144.144.1/24",
})
node.start()

# 动态加一条端口转发：本地 8080 → 虚拟 IP 10.144.144.2 的 80
node.apply_config({
    "port_forward": [
        {"bind_addr": "127.0.0.1:8080", "dst_addr": "10.144.144.2:80", "proto": "tcp"},
    ],
})

# 全量覆盖：原来的转发规则被清空，只剩这一条
node.apply_config({
    "port_forward": [
        {"bind_addr": "0.0.0.0:9090", "dst_addr": "10.144.144.3:3306", "proto": "tcp"},
    ],
})

# 清空全部转发
node.apply_config({"port_forward": []})
```

### 语义记两条就够

1. **只覆盖显式出现的字段**。`apply_config({"hostname": "x"})` 只会改 `hostname`，其它字段保持现状。
2. **集合类字段是全量覆盖**，不是追加。`port_forward` / `routes` / `exit_nodes` / `proxy_network` / `mapped_listeners` / ACL 白名单都属于这一类 —— 你给什么，就是什么。所以「加一条规则」的正确姿势是：先取当前规则（或用你自己的列表）拼好完整列表，再整体覆盖。

### 不能通过 `apply_config` 改的

以下字段在**启动期**就定死了，运行期改不了（写了也不会生效）：

- `instance_name` / `instance_id` / `network_identity` / `listeners` / `netns`
- `dhcp` / `credential_file` / `secure_mode` / `vpn_portal_config` / `socks5_proxy` / `stun_servers` 系列
- `flags` 下除 `disable_relay_data` 外的**全部**字段（`no_tun`、`mtu`、`bind_device`、打洞开关等）

> ⚠️ **`apply_config()` 要求节点处于 `Running` 状态**。在 `Created` / `Stopped` 状态下调用会失败；并且 `peer` 不通过它管理 —— 运行期连接请用 `add_connector()` / `remove_connector()` / `clear_connectors()`。
>
> 还需要注意：`apply_config` 的内部实现是「把配置翻译成一串运行时命令」，所以**单次调用里的多条规则不保证原子生效**；写业务代码时不要把它当成事务。

---

## 8. 本章小结

- 配置 = `dict` 或 TOML 字符串，字段与 `easytier-core` 一致；`None` 值会被忽略。
- **`network_identity` 决定能不能互相发现**，`listeners` 决定别人能不能连你（默认不监听！）。
- `flags` 全部有默认值，新手最需要关心 `no_tun` + `bind_device` 这一对。
- 运行期用 `apply_config()` 改配置，记住「只覆盖显式字段 + 集合类全量覆盖」；启动期字段改不了。

下一章我们看节点的完整生命周期，以及怎么把「运行状态」实时反映到你的程序里。
