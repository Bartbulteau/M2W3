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
            <div class="card-content" ref="chatwindow">
              <span class="card-title">Messages : </span>
              <div class="messages-container">
                <div v-for="(message, index) in messages" :key="index">
                  <!-- <div v-if="index < showLimit"> -->
                    <div v-if="message.author === username">
                      <strong class="authorRed">{{message.author.toUpperCase()}} : </strong>
                      <blockquote class="myblockquoteRed">
                        <p>
                          {{message.content}}
                        </p>
                        <br>
                      </blockquote>
                    </div>
                    <div v-else >
                      <strong class="authorBlue">{{message.author.toUpperCase()}} : </strong>
                      <blockquote class="myblockquoteBlue">
                        <p>
                          {{message.content}}
                        </p>
                        <br>
                      </blockquote>
                    </div>
                  <!-- </div> -->

                </div>
                <br>
                <br>
                <p class="white-text" ref="endOfScroll">testets</p>
                <br>
                <br>
              </div>
            </div>
            <div class="card-action">
              <p>
                <input type="text" v-model="msg.content" placeholder="Message" />
                <a @click="sendMsg()" class="btn right">Envoyer</a>
              </p>
              <p>
                <br>
              </p>
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
      username: "",
      showLimit: 10
    }
  },

  sockets: {
			new_message: function(msg) {
        this.messages.push(msg);
        this.$refs.endOfScroll.scrollIntoView();
      },
      messages: function(messages) {
        this.$refs.endOfScroll.scrollIntoView();
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
    this.$socket.emit('get_messages');
  },

  mounted () {
    this.$refs.endOfScroll.scrollIntoView();
  }
  
}
</script>
<style scoped>
.myblockquoteBlue {
  margin-top: 5px;
  margin-bottom: 20px;
  padding-left: 0.5rem;
  border-left: 5px solid #2196F3;
}
.card-content {
  height: 50vh;
}

.messages-container {
  overflow: scroll;
  height: 40vh;
}

.myblockquoteRed {
  margin-top: 5px;
  margin-bottom: 20px;
  padding-left: 0.5rem;
  border-left: 5px solid #ee6e73;
}

.authorRed {
  font-weight: 300;
  padding: 0px;
  color: #ee6e73;
}

.authorBlue {
  font-weight: 300;
  padding: 0px;
  color: #2196F3;
}
</style>
