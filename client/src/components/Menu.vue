<template>
  <div class="menu">

    <!-- <h1>Messages : </h1><button @click="deleteMessages()">Delete messages</button>
    <a href="/logout">Log out</a>
    <br><br><br>
    <div class="msgs"><p v-for="(message, index) in messages" :key="index"><strong>{{message.author}} : </strong> {{message.content}} <br> [id] {{message._id}}</p></div>
    <br>
    <p>Message : <input type="text" v-model="msg.content" placeholder="Message" /> <button @click="sendMsg()">Send</button></p> -->
    <div class="container">
      <div class="row">
        <div class="col s12 m8 offset-m2">
          <div class="card">
            <div class="card-content" id="chatwindow">
              <span class="card-title">Messages</span>
              <div v-for="(message, index) in messages" :key="index">
                <blockquote v-if="message.author === username">
                    <p><strong>{{message.author}} : </strong> {{message.content}} <br> [id] {{message._id}}</p>
                </blockquote>
                <blockquote class="myblockquote" v-else>
                    <p><strong>{{message.author}} : </strong> {{message.content}} <br> [id] {{message._id}}</p>
                </blockquote>
                <div id="#end"></div>
              </div>
            </div>
            <div class="card-action">
                <p>Message : <input type="text" v-model="msg.content" placeholder="Message" /> <a href="#end" @click="sendMsg()" class="btn right">Send</a></p>
                <p><br></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Menu',
  data () {
    return {
      messages: [],
      msg: {
        content: "",
        author: ""
      },
      username: "default"
    }
  },

  sockets: {
			new_message: function(msg) {
        this.messages.push(msg);
        console.log(this.$refs.chatwindow);
        this.$refs.chatwindow.scrollTop  = this.$refs.chatwindow.scrollHeight;
      },
      messages: function(messages) {
        this.messages = messages;
      },
      username: function(username) {
        this.username = username;
      }
	},

  methods: {
    sendMsg: function () {
      if (this.msg.content !== "") {
        this.msg.author = this.username
        this.$socket.emit('post_message', this.msg);
        this.msg.content = "";
      } else {
        alert('Please add a message !');
      }
    },
    deleteMessages: function() {
      this.$socket.emit('delete_messages');
      this.$socket.emit('general_update');
    }
  },

  created() {
    console.log('test');
    this.$socket.emit('get_messages');
  },

  beforeUpdate () {
    console.log('test');
  }
  
}
</script>
<style scoped>
.myblockquote {
  border-left: 5px solid #2196F3;
}
.card-content {
  overflow: scroll;
  height: 47vh;
}
</style>
