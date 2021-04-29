<template>
  <div class="conv-header">
    <div class="user">
      <Thumbnail
        :src="currentContact.thumbnail"
        size="40px"
        :badge="chatMetadata.channel"
        :username="currentContact.name"
        :status="currentContact.availability_status"
      />
      <div class="user--profile__meta">
        <h3 class="user--name text-truncate">
          {{ currentContact.name }}
        </h3>
        <button
          class="user--profile__button clear button small"
          @click="$emit('contact-panel-toggle')"
        >
          {{
            `${
              isContactPanelOpen
                ? $t('CONVERSATION.HEADER.CLOSE')
                : $t('CONVERSATION.HEADER.OPEN')
            } ${$t('CONVERSATION.HEADER.DETAILS')}`
          }}
        </button>
      </div>
    </div>
    <div
      class="header-actions-wrap"
      :class="{ 'has-open-sidebar': isContactPanelOpen }"
    >
      <template>
        <div class="contact-conversation--panel sidebar-labels-wrap" style="background: lightsteelblue; border-radius: 30px; box-shadow: inset 0 0px 1px 1px rgb(0 0 0 / 12%), 0 20px 27px 0 rgb(0 0 0 / 5%);">
          <div
            v-if="!conversationUiFlags.isFetching"
            class="contact-conversation--list"
          >
            <contact-details-item
              :title="$t('CONTACT_PANEL.LABELS.TITLE')"
              icon="ion-pricetags"
              emoji="🏷️"
              :show-edit="true"
              @edit="onEdit"
            />
            <div class="label-wrap">
              <woot-label
                v-for="label in activeLabels"
                :key="label.id"
                :title="label.title"
                :description="label.description"
                :bg-color="label.color"
              />
              <div v-if="!activeLabels.length" class="no-label-message">
                <span>{{ $t('CONTACT_PANEL.LABELS.NO_AVAILABLE_LABELS') }}</span>
              </div>
            </div>
            <add-label-to-conversation
              v-if="isEditing"
              :conversation-id="conversationId"
              :account-labels="accountLabels"
              :saved-labels="savedLabels"
              :show.sync="isEditing"
              :on-close="closeEditModal"
              :update-labels="onUpdateLabels"
            />
          </div>
          <spinner v-else></spinner>
        </div>
      </template>
      <div class="multiselect-box multiselect-wrap--small">
        <i class="icon ion-headphone" />
        <multiselect
          v-model="currentChat.meta.assignee"
          :loading="uiFlags.isFetching"
          :allow-empty="true"
          deselect-label=""
          :options="agentList"
          :placeholder="$t('CONVERSATION.ASSIGNMENT.SELECT_AGENT')"
          select-label=""
          label="name"
          selected-label
          track-by="id"
          @select="assignAgent"
          @remove="removeAgent"
        >
          <template slot="option" slot-scope="props">
            <div class="option__desc">
              <availability-status-badge
                :status="props.option.availability_status"
              />
              <span class="option__title">{{ props.option.name }}</span>
            </div>
          </template>
          <span slot="noResult">{{ $t('AGENT_MGMT.SEARCH.NO_RESULTS') }}</span>
        </multiselect>
      </div>
      <more-actions :conversation-id="currentChat.id" />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import MoreActions from './MoreActions';
import Thumbnail from '../Thumbnail';
import AvailabilityStatusBadge from '../conversation/AvailabilityStatusBadge';

export default {
  components: {
    MoreActions,
    Thumbnail,
    AvailabilityStatusBadge,
  },

  props: {
    chat: {
      type: Object,
      default: () => {},
    },
    isContactPanelOpen: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      currentChatAssignee: null,
    };
  },

  computed: {
    ...mapGetters({
      getAgents: 'inboxAssignableAgents/getAssignableAgents',
      uiFlags: 'inboxAssignableAgents/getUIFlags',
      currentChat: 'getSelectedChat',
    }),

    chatMetadata() {
      return this.chat.meta;
    },

    currentContact() {
      return this.$store.getters['contacts/getContact'](
        this.chat.meta.sender.id
      );
    },

    agentList() {
      const { inbox_id: inboxId } = this.chat;
      const agents = this.getAgents(inboxId) || [];
      return [
        {
          confirmed: true,
          name: 'None',
          id: 0,
          role: 'agent',
          account_id: 0,
          email: 'None',
        },
        ...agents,
      ];
    },
  },

  methods: {
    assignAgent(agent) {
      this.$store
        .dispatch('assignAgent', {
          conversationId: this.currentChat.id,
          agentId: agent.id,
        })
        .then(() => {
          bus.$emit('newToastMessage', this.$t('CONVERSATION.CHANGE_AGENT'));
        });
    },
    removeAgent() {},
  },
};
</script>

<style lang="scss" scoped>
.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conv-header {
  flex: 0 0 var(--space-jumbo);
}

.option__desc {
  display: flex;
  align-items: center;
}

.option__desc {
  &::v-deep .status-badge {
    margin-right: var(--space-small);
    min-width: 0;
    flex-shrink: 0;
  }
}

.conv-details--item {
  padding-bottom: var(--space-normal);

  .conv-details--item__label {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--space-smaller);

    .edit-button {
      padding: 0; 
    }
  }

  .conv-details--item__value {
    word-break: break-all;
    margin-left: var(--space-medium);
  }

  .title--icon .icon--emoji,
  .title--icon .icon--font {
    margin-right: var(--space-small);
  }

  .title--icon {
    display: flex;
    align-items: center;
  }
}
</style>
